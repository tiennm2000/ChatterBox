import { Socket, Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import Message, { IMessage } from "./models/MessagesModel";
import Channel from "./models/ChannelModel";
import { MessageChannel } from "./utils/types";

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

  //send message for channel
  const sendChannelMessage = async (message: MessageChannel) => {
    const { channelId, sender, content, messageType, fileUrl } = message;
    const createdMessage = await Message.create({
      sender,
      recipient: null,
      content,
      messageType,
      timestamp: new Date(),
      fileUrl,
    });

    const messageData = await Message.findById(createdMessage._id)
      .populate("sender", "_id email firstName lastName image color")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: createdMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");
    const finalData = { ...messageData?.toObject(), channelId };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = useSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receive-channel-message", finalData);
        }
      });
      const adminSocketId = useSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receive-channel-message", finalData);
      }
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
    socket.on("send-channel-message", sendChannelMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
