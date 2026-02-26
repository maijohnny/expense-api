import { Document, Types } from "mongoose";

export enum ExpenseType {
    INCOME = "INCOME",
    OUTCOME = "OUTCOME",
}

export interface ICategory extends Document {
    title: string;
    description?: string;
    type: ExpenseType,
    userId: Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}