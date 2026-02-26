import { Document, Types } from "mongoose";

export interface IMessage extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    message: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}