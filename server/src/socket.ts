import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";

const setupSocket = (server: HTTPSServer | HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const useSocketMap = new Map();

  const disconnect = (socket: Socket) => {
    console.log("Client Disconnected: " + socket.id);
    for (const [userId, socketId] of useSocketMap.entries()) {
      if (socketId === socket.id) {
        useSocketMap.delete(userId);
        break;
      }
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      useSocketMap.set(userId, socket.id);
      console.log(`User id: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("User ID not provide during connection.");
    }
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
