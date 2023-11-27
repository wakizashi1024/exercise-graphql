import mongoose from "mongoose";
import SHA256 from "crypto-js/sha256.js";

import { baseModel } from "./base.js";

// 定義User模型
const userSchema = new mongoose.Schema({
    ...baseModel,
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        // TODO: Move hash function to utils
        set: (value) => SHA256(value).toString(),
        select: false,
    },
    bio: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
});

export { userSchema };