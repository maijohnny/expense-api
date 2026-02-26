import { model, Schema, Types } from "mongoose";
import { IMessage } from "../types/IMessage";

const messageSchema: Schema<IMessage> = new Schema({
    senderId: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "Please enter senderId"]
    },
    receiverId: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "Please enter senderId"]
    },
    message: {
        type: String,
        required: [true, "Please enter message"]
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const MessageModel = model<IMessage>("messages", messageSchema);
export default MessageModel;