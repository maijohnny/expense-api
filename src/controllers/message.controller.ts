import { NextFunction, Request, Response } from "express";
import CatchAsyncError from "../middlewares/catchAsyncError";
import MessageModel from "../models/message.model";
import { getReceiverSocketId } from "../socket/socket";
import ErrorHandler from "../utils/ErrorHandler";

type TSendMessageReq = {
    receiverId: string; 
    message: string;
}
export const sendMessage = CatchAsyncError(
    async(req: Request, res: Response, next: NextFunction) => {
        const currentUserId = req.user._id;
        const { receiverId, message } = req.body as TSendMessageReq;

        const newMessage = await MessageModel.create({ 
            senderId: currentUserId, 
            receiverId, 
            message
        });
        
        const receiverSocketId = getReceiverSocketId(receiverId);
        const io = req.app.get("socketio");
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({
            success: true,
            message: newMessage,
        })
    }
);

export const getMessages = CatchAsyncError(
    async(req: Request, res: Response, next: NextFunction) => {
        const { receiverId } = req.params;
        const senderId = req.user._id.toString();

        const messages = await MessageModel.find({
            isDeleted: false,
            $or: [
                {senderId: senderId, receiverId: receiverId },
                {senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            messages,
        })
    }
);

export const deleteMessage = CatchAsyncError(
    async(req: Request, res: Response, next: NextFunction) => {
        const currentUserId = req.user._id;
        const { messageId } = req.params;

        const message = await MessageModel.findById(messageId);
        if (!message || message.isDeleted) {
            return next(new ErrorHandler("Message not found", 404));
        }
        if (message.senderId.toString() !== currentUserId.toString()) {
            return next(new ErrorHandler("You can't delete this message!", 403));
        }
        message.isDeleted = true;
        await message.save();

        res.status(200).json({
            success: true,
            message: "Message is deleted successfully!",
        })
    }
);