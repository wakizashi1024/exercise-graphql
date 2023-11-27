import mongoose from "mongoose";

import { userSchema } from "./user.js";
import { articleSchema } from "./article.js";
import "dotenv/config.js";

// 從設定檔取得連線參數
const { MONGO_URI: dbUri, MONGO_USER: dbUser, MONGO_PASS: dbPass, MONGO_DBNAME: dbName } = process.env;
// console.log(dbUri, dbUser, dbPass);

// 連線到MongoDB
mongoose.connect(dbUri, {
    user: dbUser,
    pass: dbPass,
    dbName: dbName,
});

// 取得連線參考
const db = mongoose.connection;

// DB連線失敗時觸發
db.on("error", (err) => {
    console.error(`Mongoose connection error: ${err}`);
});

// DB連線成功時觸發
db.once("open", () => {
    console.log("Mongoose connected successfully");
});

// 綁定模型
const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);

export { User, Article };
export default { User, Article };
