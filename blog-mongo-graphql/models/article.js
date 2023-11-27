import mongoose from "mongoose";

import { baseModel } from "./base.js";

// 定義Article模型
const articleSchema = new mongoose.Schema({
    ...baseModel,
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

export { articleSchema };
