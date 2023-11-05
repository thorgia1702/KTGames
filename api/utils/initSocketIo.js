// Server-side: initSocketIo.js
import { Server } from "socket.io";

let rooms = new Map();

export let io;

export default function initSocketIo(httpServer) {
  io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  let waitingPlayers = [];

  io.on("connection", (socket) => {
    socket.on("findGame", (playerId) => {
      let roomId;

      if (waitingPlayers.length > 0) {
        const waitingPlayer = waitingPlayers.shift();
        roomId = `${waitingPlayer.playerId}_${playerId}_${Date.now()}`;
        waitingPlayer.socket.join(roomId);
        socket.join(roomId);

        rooms.set(roomId, {
          players: [waitingPlayer.socket, socket],
          currentPlayer: 0, // Randomize who starts
        });

        waitingPlayer.socket.roomId = roomId;
        waitingPlayer.socket.playerId = waitingPlayer.playerId;
        socket.roomId = roomId;
        socket.playerId = playerId;

        // Emit to both players who starts first
        const startingPlayerId =
          rooms.get(roomId).players[rooms.get(roomId).currentPlayer].playerId;
        io.to(roomId).emit("startGame", [waitingPlayer.playerId, playerId]);
        io.to(roomId).emit("updateTurn", startingPlayerId);
      } else {
        waitingPlayers.push({ socket, playerId });
        socket.emit("waitingForOpponent");
      }
    });

    socket.on("move", (data) => {
      const room = rooms.get(socket.roomId);
      if (!room) return;

      if (room.players[room.currentPlayer].id === socket.id) {
        const { board } = data;
        room.board = board;
        io.to(socket.roomId).emit("gameUpdate", board);

        // Switch to the other player's turn
        room.currentPlayer = 1 - room.currentPlayer;
        const nextPlayerId = room.players[room.currentPlayer].playerId;
        io.to(socket.roomId).emit("updateTurn", nextPlayerId);
      }
    });

    socket.on("disconnect", () => {
      waitingPlayers = waitingPlayers.filter(
        (player) => player.socket !== socket
      );
      const room = rooms.get(socket.roomId);
      if (room) {
        io.to(socket.roomId).emit("playerDisconnected");
        rooms.delete(socket.roomId);
      }
    });
  });
}
