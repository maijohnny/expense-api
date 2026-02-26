import { Document, Types } from "mongoose";
import { ExpenseType } from "./ICategory";

export interface IExpense extends Document {
    type: ExpenseType,
    description: string;
    remark?: string;
    qty: number;
    unit?: string;
    amount: number;
    totalAmount: number;
    date: Date;
    categoryId: Types.ObjectId;
    userId: Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}