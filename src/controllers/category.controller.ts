import { NextFunction, Request, Response } from "express";
import CatchAsyncError from "../middlewares/catchAsyncError";
import { ExpenseType, ICategory } from "../types/ICategory";
import ErrorHandler from "../utils/ErrorHandler";
import CategoryModel from "../models/category.model";

// Create category
export const createCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { title, description, type } = req.body as Partial<ICategory>;
        const userId = req.user._id;

        if (!title || !type) {
            return next(new ErrorHandler("Title and type are required!", 400));
        }

        if (type !== ExpenseType.INCOME && type !== ExpenseType.OUTCOME) {
            return next(new ErrorHandler("Invalid type!", 400));
        }

        const category = await CategoryModel.create({ title, description, type, userId });

        res.status(201).json({
            success: true,
            category,
        })
    }
);

// Update category
export const updateCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { title, description } = req.body as Partial<ICategory>;
        const { id } = req.params;
        const currentUserId = req.user._id;

        const category = await CategoryModel.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found!", 404));
        }

        if (category.userId.toString() !== currentUserId.toString()) {
            return next(new ErrorHandler("You can't update other user category!", 403));
        }

        if (title && title !== category.title) category.title = title;
        if (description && description !== category.description) category.description = description;
        const updatedCategory = await category.save();

        res.status(201).json({
            success: true,
            category: updatedCategory,
        })
    }
);

// Get all categories
export const getAllCategories = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const currentUserId = req.user._id;

        const categories = await CategoryModel.find({ userId: currentUserId });

        res.status(200).json({
            success: true,
            categories,
        })
    }
);

// Delete Category
export const deleteCategory = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const currentUserId = req.user._id;

        const category = await CategoryModel.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found!", 404));
        }

        if (category.userId.toString() !== currentUserId.toString()) {
            return next(new ErrorHandler("You can't delete other user category!", 403));
        }

        await category.deleteOne();

        res.status(200).json({
            success: true,
            message: "Category is deleted successfully!",
        })
    }
);