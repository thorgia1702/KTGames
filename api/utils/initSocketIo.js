import { Server } from "socket.io";

export let io;
export default function initSocketIo(httpServer) {
  io = new Server(httpServer, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    const roomId = 123;
    console.log("Connect socket io success");
  });
}
