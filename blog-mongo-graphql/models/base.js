import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";

// dayjs utc插件
dayjs.extend(utc);

// 定義底層模型
const baseModel = {
    createdAt: {
        type: String,
        default: dayjs.utc().format(),
    },
    updatedAt: {
        type: String,
        default: dayjs.utc().format(),
    },
};

export { baseModel };
