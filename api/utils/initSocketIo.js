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

    function calculateWinner_bingo(cells) {
      const lines = [
        [0, 1, 2, 3, 4],
        [5, 6, 7, 8, 9],
        [10, 11, 12, 13, 14],
        [15, 16, 17, 18, 19],
        [20, 21, 22, 23, 24],
        [0, 5, 10, 15, 20],
        [1, 6, 11, 16, 21],
        [2, 7, 12, 17, 22],
        [3, 8, 13, 18, 23],
        [4, 9, 14, 19, 24],
        [0, 6, 12, 18, 24],
        [4, 8, 12, 16, 20],
      ];

      let completeLines = 0;

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        // Check if all cells in a line are marked with "X"
        if (
          cells[a] === "X" &&
          cells[b] === "X" &&
          cells[c] === "X" &&
          cells[d] === "X" &&
          cells[e] === "X"
        ) {
          completeLines += 1;
        }
      }

      return completeLines; // Returns the count of complete lines
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
          players: [
            { playerId: waitingPlayer.playerId, socket: waitingPlayer.socket },
            { playerId, socket },
          ],
          currentPlayer: 0,
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
          io.to(roomId).emit("updateTurn", { nextPlayerId: startingPlayerId });
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

      const currentPlayerIndex = room.currentPlayer;
      const currentPlayerSocket = room.players[currentPlayerIndex].socket;

      // Check if the current player is the one making the move
      if (currentPlayerSocket.id === socket.id) {
        // Tic Tac Toe specific move handling
        if (room.gameType === "tic-tac-toe") {
          // Check if the current player is the one making the move
          if (room.players[currentPlayerIndex].playerId === socket.playerId) {
            room.board = data.board;
            io.to(socket.roomId).emit("gameUpdate", room.board);
            // Toggle the currentPlayer to the next player
            room.currentPlayer = (currentPlayerIndex + 1) % room.players.length;
            io.to(socket.roomId).emit("updateTurn", {
              nextPlayerId: room.players[room.currentPlayer].playerId,
            });
          }
        }

        // Bingo specific move handling
        if (room.gameType === "bingo") {
          // Find the board for the current player
          const currentBoard = room.bingoBoard[currentPlayerIndex];

          // Mark the number on both boards
          room.bingoBoard.forEach((playerBoard) => {
            const cellToMark = playerBoard.find(
              (cell) => cell.number === currentBoard[data.index].number
            );
            if (cellToMark) {
              cellToMark.marked = true;
            }
          });

          // Initialize variables to check for draw and winner
          let draw = false;
          let winnerId = null;
          let drawPlayers = [];

          // Check each player board for a winner or a draw
          room.bingoBoard.forEach((playerBoard, index) => {
            const markedBoard = playerBoard.map((cell) =>
              cell.marked ? "X" : ""
            );
            const winnerLines = calculateWinner_bingo(markedBoard);

            if (winnerLines >= 5) {
              if (winnerId) {
                // If there's already a winner and another player also wins, it's a draw
                draw = true;
                drawPlayers.push(room.players[index].playerId);
              } else {
                winnerId = room.players[index].playerId;
                drawPlayers.push(winnerId);
              }
            }
          });

          if (draw) {
            // Notify all clients in the room that the game is a draw
            io.to(socket.roomId).emit("gameDraw", {
              players: drawPlayers,
            });
            // Optionally, perform any other cleanup or state updates as necessary
          } else if (winnerId) {
            // Notify all clients in the room that there is a winner
            io.to(socket.roomId).emit("gameWon", {
              winnerId: winnerId,
            });
            // Optionally, perform any other cleanup or state updates as necessary
          } else {
            // Notify both players with the new board states
            room.players.forEach((player, index) => {
              io.to(player.socket.id).emit(
                "gameUpdate",
                room.bingoBoard[index]
              );
            });

            // Update the current player
            room.currentPlayer = (currentPlayerIndex + 1) % room.players.length;
            io.to(socket.roomId).emit("updateTurn", {
              nextPlayerId: room.players[room.currentPlayer].playerId,
            });
          }
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
