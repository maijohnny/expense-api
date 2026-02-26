import { model, Schema, Types } from "mongoose";
import { IExpense } from "../types/IExpense";

const expenseSchema: Schema<IExpense> = new Schema({
    description: {
        type: String,
        required: [true, "Please enter description"],
    },
    remark: {
        type: String,
    },
    type: {
        type: String,
        required: [true, "Please enter type"],
    },
    qty: {
        type: Number,
        default: 1,
    },
    unit: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true, "Please enter amount"],
    },
    totalAmount: {
        type: Number,
        required: [true, "Please enter total amount"],
    },
    date: {
        type: Date,
        default: new Date(),
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "categories",
        required: [true, "Please enter categoryId"],
    },
    userId: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "Please enter userId"],
    },
}, { timestamps: true });

const ExpenseModel = model<IExpense>("expenses", expenseSchema);
export default ExpenseModel;