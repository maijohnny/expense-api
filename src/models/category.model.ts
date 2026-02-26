import { model, Schema, Types } from "mongoose";
import { ICategory } from "../types/ICategory";

const categorySchema: Schema<ICategory> = new Schema({
    title: {
        type: String,
        required: [true, "Please enter title"],
    },
    description: {
        type: String,
    },
    type: {
        type: String,
        required: [true, "Please enter type"],
    },
    userId: {
        type: Types.ObjectId,
        ref: "users",
        required: [true, "Please enter userId"],
    },
}, { timestamps: true });

const CategoryModel = model<ICategory>("categories", categorySchema);
export default CategoryModel;