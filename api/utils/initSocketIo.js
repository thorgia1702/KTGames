import { Server } from "socket.io";

let rooms = new Map();

export let io;

export default function initSocketIo(httpServer) {
  io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  let waitingPlayersTicTacToe = [];
  let waitingPlayersBingo = [];

  io.on("connection", (socket) => {
    function createBingoBoard() {
      // Initialize a 5x5 Bingo board
      let board = Array.from({ length: 25 }, (_, i) => ({
        number: i + 1,
        marked: false,
      }));
      // Shuffle the board numbers for randomness
      for (let i = board.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [board[i], board[j]] = [board[j], board[i]];
      }
      return board;
    }

    // General function to join a room for any game type
    function joinRoom(playerId, waitingPlayers, gameType) {
      let roomId;
      if (waitingPlayers.length > 0) {
        const waitingPlayer = waitingPlayers.shift();
        roomId = `${waitingPlayer.playerId}_${playerId}_${Date.now()}`;
        waitingPlayer.socket.join(roomId);
        socket.join(roomId);

        // Initialize the room with the default values for the game
        rooms.set(roomId, {
          players: [waitingPlayer.socket, socket],
          currentPlayer: 0, //Math.round(Math.random()), // Randomly select who starts
          gameType: gameType,
          // Specific game states can be added here e.g. board for Tic Tac Toe or bingoBoard for Bingo
        });

        waitingPlayer.socket.roomId = roomId;
        waitingPlayer.socket.playerId = waitingPlayer.playerId;
        socket.roomId = roomId;
        socket.playerId = playerId;

        // Notify both players that the game is starting
        io.to(roomId).emit("startGame", {
          roomId: roomId,
          players: [waitingPlayer.playerId, playerId],
          gameType: gameType,
          // Include any game-specific state you need to initialize
        });

        if (gameType === "bingo") {
          let bingoBoardPlayerOne = createBingoBoard();
          let bingoBoardPlayerTwo = createBingoBoard();
          rooms.get(roomId).bingoBoard = [
            bingoBoardPlayerOne,
            bingoBoardPlayerTwo,
          ];
          waitingPlayer.socket.emit("startGame", {
            roomId: roomId,
            players: [waitingPlayer.playerId, playerId],
            gameType: gameType,
            board: bingoBoardPlayerOne, // Send the first player their board
          });

          socket.emit("startGame", {
            roomId: roomId,
            players: [waitingPlayer.playerId, playerId],
            gameType: gameType,
            board: bingoBoardPlayerTwo, // Send the second player their board
          });
        }

        // If it's a turn-based game, notify players whose turn it is
        if (gameType === "tic-tac-toe" || gameType === "bingo") {
          const startingPlayerId =
            rooms.get(roomId).players[rooms.get(roomId).currentPlayer].playerId;
          io.to(roomId).emit("updateTurn", startingPlayerId);
        }
      } else {
        waitingPlayers.push({ socket, playerId });
        socket.emit("waitingForOpponent");
      }
    }

    // Tic Tac Toe game request
    socket.on("findGameTicTacToe", (playerId) => {
      joinRoom(playerId, waitingPlayersTicTacToe, "tic-tac-toe");
    });

    // Bingo game request
    socket.on("findGameBingo", (playerId) => {
      joinRoom(playerId, waitingPlayersBingo, "bingo");
    });

    // Handle moves for both games
    socket.on("move", (data) => {
      const room = rooms.get(socket.roomId);
      if (!room) return;

      // Tic Tac Toe specific move handling
      if (room.gameType === "tic-tac-toe") {
        if (room.players[room.currentPlayer].id === socket.id) {
          room.board = data.board;
          io.to(socket.roomId).emit("gameUpdate", room.board);
          room.currentPlayer = 1 - room.currentPlayer;
          io.to(socket.roomId).emit(
            "updateTurn",
            room.players[room.currentPlayer].playerId
          );
        }
      }

      // Bingo specific move handling
      if (room.gameType === "bingo") {
        if (room.players[room.currentPlayer].id === socket.id) {
          // Get the number that was marked
          const numberToMark =
            room.bingoBoard[room.currentPlayer][data.index].number;

          // Mark this number on both players' boards
          room.bingoBoard.forEach((board) => {
            const cellToMark = board.find(
              (cell) => cell.number === numberToMark
            );
            if (cellToMark) {
              cellToMark.marked = true;
            }
          });

          // Notify both players with the updated state of their own board
          room.players.forEach((playerSocket, index) => {
            io.to(playerSocket.id).emit("gameUpdate", room.bingoBoard[index]);
          });

          // Switch to the next player's turn
          room.currentPlayer = 1 - room.currentPlayer;
          io.to(socket.roomId).emit(
            "updateTurn",
            room.players[room.currentPlayer].playerId
          );
        }
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      // Remove the player from the waiting list if they're still waiting
      waitingPlayersTicTacToe = waitingPlayersTicTacToe.filter(
        (player) => player.socket !== socket
      );
      waitingPlayersBingo = waitingPlayersBingo.filter(
        (player) => player.socket !== socket
      );
      // Notify the other player and clean up the room
      const room = rooms.get(socket.roomId);
      if (room) {
        io.to(socket.roomId).emit("playerDisconnected", {
          playerLeft: socket.playerId,
        });
        rooms.delete(socket.roomId);
      }
    });
  });
}