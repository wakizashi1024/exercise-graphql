import SHA256 from "crypto-js/sha256.js";
import { UserInputError, ForbiddenError, AuthenticationError, AuthorizationError } from "../errors/index.js";
import jwt from "jsonwebtoken";

const { JWT_SECRET: jwtSecret } = process.env;

const resolvers = {
    Query: {
        foo: (parent, args, context, info) => {
            // console.log(context);
            return "bar";
        },
        // TODO: Implement schema directive to prevent redundancies
        currentUser: async (parent, args, context, info) => {
            // 取得當前使用者Token
            const { token, dataSources } = context;
            if (!token) {
                throw new AuthenticationError("Please login first");
            }
            
            // 驗證Token是否正確
            if(!jwt.verify(token, jwtSecret)) {
                throw new AuthorizationError("Token expired or invalid");
            };

            const { userId } = jwt.decode(token);
            const userData = await dataSources.users.findByUserId(userId);
            if (!userData) {
                throw new UserInputError("User not found");
            }

            return userData.toObject();
        }
    },
    Mutation: {
        async register(parent, args, context, info) {
            const { user } = args;
            const { dataSources } = context;

            // 判斷使用者是否已存在於資料庫
            if (await dataSources.users.findByUserName(user.username)) {
                throw new UserInputError("User Exists");
            }

            // 判斷信箱是否已註冊
            if (await dataSources.users.findByEmail(user.email)) {
                throw new UserInputError("Email has been registered");
            }

            // 保存使用者到資料庫
            const storedUserData = await dataSources.users.saveUser(user);

            // TODO: Move to utils
            // 產生token
            const token = await jwt.sign(
                { userId: storedUserData._id },
                jwtSecret,
                { expiresIn: 60 * 60 * 24 }
            );

            return {
                user: {
                    ...storedUserData.toObject(),
                    token: token,
                },
            };
        },
        async login(parent, args, context, info) {
            const { user } = args;
            const { dataSources } = context;

            // 取出對應的使用者資料
            const userData = await dataSources.users.findByEmail(user.email, { withPassword: true });
            if (!userData) {
                throw new AuthenticationError("User is not exists");
            }

            // 比對密碼是否正確
            console.log(userData.toObject())
            if (SHA256(user.password).toString() !== userData.password) { // TODO: Move to utils
                throw new AuthenticationError("Password is not correct");
            }

            // TODO: Move to utils
            // 產生token
            const token = await jwt.sign(
                { userId: userData._id },
                jwtSecret,
                { expiresIn: 60 * 60 * 24 }
            );

            return {
                user: {
                    ...userData.toObject(),
                    token: token,
                },
            };
        }
    },
};

export { resolvers };
