import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";
import jwt from "jsonwebtoken";

import { AuthenticationError, AuthorizationError } from "../errors/index.js";

const { JWT_SECRET: jwtSecret } = process.env;

// 建立@auth directive schena定義及其Transformer
function authDirective(directiveName) {
    return {
        // Schema custom directive定義
        authDirectiveTypeDefs: `directive @${directiveName}(roles: [String]) on FIELD_DEFINITION`,
        // Transfromer用於轉換Schema中所有Resolver中含有@auth directive的欄位
        // 驗證使用者Token及其權限符合後執行Resolver原來定義之行為
        authDirectiveTransformer: (schema) =>
            mapSchema(schema, {
                // Shema中每個物件欄位執行一次
                [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                    // 取得@auth directive
                    const authDirective = getDirective(
                        schema,
                        fieldConfig,
                        directiveName
                    )?.[0];

                    // 如果該欄位有@auth directive
                    if (authDirective) {
                        // 取得該欄位的resolver
                        const { resolve = defaultFieldResolver } = fieldConfig;

                        // 取代該欄位的resolver為新的resolver(這裡先驗證Token和使用者權限，再執行原有的resolver)
                        return {
                            ...fieldConfig,
                            resolve: async function (
                                source,
                                args,
                                context,
                                info
                            ) {
                                const { token, dataSources } = context;
                                if (!token) {
                                    throw new AuthenticationError(
                                        "Please login first"
                                    );
                                }

                                // TODO: Move to utils
                                // 驗證Token是否正確
                                try {
                                    const jwtPayload = jwt.verify(token, jwtSecret);
                                    if (!jwtPayload || !jwtPayload.userId) {
                                        throw new AuthorizationError(
                                            "Token expired or invalid"
                                        );
                                    }

                                    const userData = await dataSources.users.findByUserId(jwtPayload.userId);
                                    if (!userData) {
                                        throw new AuthorizationError(
                                            "User not found"
                                        );
                                    }

                                    context.user = userData.toObject();

                                    const { roles } = authDirective;
                                    if (roles) {
                                        console.log(roles);
                                        // Check user roles then append these roles to the context
                                    }

                                } catch (err) {
                                    console.error(err);
                                    throw new AuthorizationError(
                                        "Token expired or invalid"
                                    );
                                }

                                const result = await resolve(
                                    source,
                                    args,
                                    context,
                                    info
                                );
                                return result;
                            },
                        };
                    }
                },
            }),
    };
}

export { authDirective };
