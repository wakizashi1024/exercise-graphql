import dbModel from "../models/index.js";
import { Users } from "./user.js";
import { Articles } from "./article.js";

// 建立資料來源映射供Apollo Server使用
const dataSource = {
    // MongoDataSource需要傳入模型或資料庫集合
    users: new Users({ modelOrCollection: dbModel.User }),
    articles: new Articles({ modelOrCollection: dbModel.Article }),
};

export default dataSource;