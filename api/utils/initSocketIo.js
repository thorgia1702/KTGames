import { Server } from "socket.io";

let rooms = new Map(); // Store room data

export let io;

export default function initSocketIo(httpServer) {
  io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (roomId, name) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.name = name;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          players: [socket],
          currentPlayer: 0, // Index of the current player (0 or 1)
          board: Array(100).fill(null),
        });
      } else {
        const room = rooms.get(roomId);
        room.players.push(socket);

        if (room.players.length === 2) {
          // Start the game
          io.to(roomId).emit("startGame", room.players[0].name);
        }
      }
    });

    socket.on("move", (data) => {
      const room = rooms.get(socket.roomId);
      if (socket === room.players[room.currentPlayer]) {
        const { board } = data;
        room.board = board;
        io.to(socket.roomId).emit("gameUpdate", board);
        room.currentPlayer = 1 - room.currentPlayer; // Toggle between 0 and 1
      }
    });

    socket.on("newMatch", () => {
      const room = rooms.get(socket.roomId);
      room.board = Array(100).fill(null);
      room.currentPlayer = 0;
      io.to(socket.roomId).emit("gameUpdate", room.board); // Send a reset board message
    });

    socket.on("disconnect", () => {
      const room = rooms.get(socket.roomId);
      if (room) {
        // Handle player disconnections and clean up the game state
        io.to(socket.roomId).emit("playerDisconnected");
        rooms.delete(socket.roomId);
      }
    });
  });
}
