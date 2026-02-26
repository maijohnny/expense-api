import { Server } from "socket.io";
import http from "http";

const userSocketMap: {[key: string]: string} = {}

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId]
}

export const initializeSocket = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ['GET', 'POST']
        }
    });

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId as string;
        if (userId) {
            userSocketMap[userId] = socket.id;
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        socket.on("disconnect", () => {
            delete userSocketMap[userId];
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    })

    return io;
}