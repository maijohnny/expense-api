import { NextFunction, Request, Response } from "express";
import CatchAsyncError from "../middlewares/catchAsyncError";
import { IExpense } from "../types/IExpense";
import ErrorHandler from "../utils/ErrorHandler";
import CategoryModel from "../models/category.model";
import ExpenseModel from "../models/expense.model";
import { ExpenseType } from "../types/ICategory";

// Create Expense
export const createExpense = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { description, remark, qty, unit, amount, categoryId, date } = req.body as Partial<IExpense>;
    const currentUserId = req.user._id;

    if (!description || !amount || !categoryId) {
        return next(new ErrorHandler("Pelase enter all required fields", 400))
    }

    const category = await CategoryModel.findById(categoryId);
    if (!category) {
        return next(new ErrorHandler("Category not found", 404))
    }

    const totalAmount = (qty || 1) * amount;
    const expense = await ExpenseModel.create({
        description,
        remark,
        type: category.type,
        qty,
        unit,
        amount,
        totalAmount,
        date,
        categoryId,
        userId: currentUserId,
    })

    res.status(201).json({
        success: true,
        expense,
    })
  },
);

// Update Expense
export const updateExpense = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { description, remark, qty, unit, amount, date } = req.body as Partial<IExpense>;
        const currentUserId = req.user._id;

        const expense = await ExpenseModel.findById(id);
        if (!expense) {
            return next(new ErrorHandler("Expense not found", 404));
        }

        if (expense.userId.toString() !== currentUserId.toString()) {
            return next(new ErrorHandler("You can't update other user expense!", 403));
        }

        if (description) expense.description = description;
        if (remark) expense.remark = remark;
        if (qty) expense.qty = qty;
        if (unit) expense.unit = unit;
        if (amount) expense.amount = amount;
        if (date) expense.date = date;
        expense.totalAmount = expense.qty * expense.amount;

        const updatedExpense = await expense.save();
        
        res.status(201).json({
            success: true,
            expense: updatedExpense,
        });
    }
);

// Get All Expenses
type TGetExpensesReq = {
    type?: ExpenseType;
    categoryId?: string;
    page?: string;
    limit?: string;

    filterBy?: "date" | "dateRange" | "month";
    date?: string;
    startDate?: string;
    endDate?: string;
    month?: string;
}

export const getAllExpenses = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { type, categoryId, page, limit, filterBy, date, startDate, endDate, month} = req.query as Partial<TGetExpensesReq>;
        const currentUserId = req.user._id;

        const pageInt = parseInt(page || "1");
        const limitInt = parseInt(limit || "10");
        const offSet = (pageInt - 1) * limitInt;

        let where: any = { userId: currentUserId };
        if (type === ExpenseType.INCOME || type === ExpenseType.OUTCOME) {
            where.type = type
        }

        if (categoryId) {
            const category = await CategoryModel.findById(categoryId);
            if (!category) {
                return next(new ErrorHandler("Category not found!", 404));
            }
            where.categoryId = categoryId;
        }
        // 2026-02-25
        if (filterBy === "date" && date) {
            const start = new Date(date); // 0 hr, 0 min, 0 sec, 0 milisec
            const end = new Date(date);
            end.setHours(23, 59, 59, 999); // 23 hr, 59 min, 59 sec, 999 milisec
            where.date = { $gte: start, $lte: end };
        }

        // startDate = 2026-02-20, endDate = 2026-02-25
        if (filterBy === "dateRange" && startDate && endDate) {
            const start = new Date(startDate); // 2026-02-20, 0hr, 0min, 0sec, 0milisec
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // 2026-02-25, 23hr, 59min, 59sec, 999 milisec
            where.date = { $gte: start, $lte: end };
        }

        // 2026-02
        if (filterBy === "month" && month) {
            const [year, mon] = month.split("-").map(Number);
            const start = new Date(year, mon - 1, 1);
            const end = new Date(year, mon, 0, 23, 59, 59, 999);
            where.date = { $gte: start, $lte: end };
        }

        const expenses = await ExpenseModel
            .find(where)
            .limit(limitInt)
            .skip(offSet)
            .populate({ path: "categoryId" })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            expenses,
        })
    }
);

// Delete Expense
export const deleteExpense = CatchAsyncError(
    async(req: Request, res: Response, next: NextFunction) => {
        const currentUserId = req.user._id;
        const { id } = req.params;
        
        const expense = await ExpenseModel.findById(id);
        if (!expense) {
            return next(new ErrorHandler("Expense not found!", 404));
        }
        if (expense.userId.toString() !== currentUserId.toString()) {
            return next(new ErrorHandler("You can't delete other user expense!", 403));
        }
        await expense.deleteOne();

        res.status(200).json({
            success: true,
            message: "Expense deleted successfully!",
        })
    }
);