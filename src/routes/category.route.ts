import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../controllers/category.controller";

const categoryRouter = express.Router();

categoryRouter.post('/', isAuthenticated, createCategory);
categoryRouter.patch('/:id', isAuthenticated, updateCategory);
categoryRouter.get('/', isAuthenticated, getAllCategories);
categoryRouter.delete('/:id', isAuthenticated, deleteCategory);

export default categoryRouter;