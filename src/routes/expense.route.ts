import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createExpense, deleteExpense, getAllExpenses, updateExpense } from "../controllers/expense.controller";

const expenseRouter = express.Router();

expenseRouter.post('/', isAuthenticated, createExpense);
expenseRouter.patch('/:id', isAuthenticated, updateExpense);
expenseRouter.get('/', isAuthenticated, getAllExpenses);
expenseRouter.delete('/:id', isAuthenticated, deleteExpense);

export default expenseRouter;