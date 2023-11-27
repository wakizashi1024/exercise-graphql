import { UserInputError } from "./user-input-error.js";
import { ForbiddenError } from "./forbidden-error.js";
import { AuthenticationError } from "./authentication-error.js";
import { AuthorizationError } from "./authorization-error.js";

// Apollo Server v4不再提供內建錯誤類別，參考官方文件內給的提示&
// 參考GraphQL部分原始碼(GraphQLError)建立自訂錯誤類別
// Refs:
// [1] https://www.apollographql.com/docs/apollo-server/migration/#apolloerror
// [2] node_modules/graphql/error/GraphQLError.js
export { UserInputError, ForbiddenError, AuthenticationError, AuthorizationError };
export default { UserInputError, ForbiddenError, AuthenticationError, AuthorizationError };
