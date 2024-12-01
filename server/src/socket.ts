import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import Message, { IMessage } from "./models/MessagesModel";

const setupSocket = (server: HTTPSServer | HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const useSocketMap = new Map();

  //disconnect handle
  const disconnect = (socket: Socket) => {
    console.log("Client Disconnected: " + socket.id);
    for (const [userId, socketId] of useSocketMap.entries()) {
      if (socketId === socket.id) {
        useSocketMap.delete(userId);
        break;
      }
    }
  };

  //send message handle
  const sendMessage = async (message: IMessage) => {
    const senderSocketId = useSocketMap.get(message.sender);
    const recipientSocketId = useSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);

    const messageData = await Message.findById(createMessage._id)
      .populate("sender", "id email firstName lastName image color")
      .populate("recipient", "id email firstName lastName image color");

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };

  //connection
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      useSocketMap.set(userId, socket.id);
      console.log(`User id: ${userId} with socket id: ${socket.id}`);
    } else {
      console.log("User ID not provide during connection.");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
