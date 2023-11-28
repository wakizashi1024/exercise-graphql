import { makeExecutableSchema } from "@graphql-tools/schema";

import { typeDefs } from "./type-defs/index.js";
import { resolvers } from "./resolvers/index.js";
import { upperCaseDirective } from "./schema-directives/upper-case.js";
import { authDirective } from "./schema-directives/auth.js";

const { upperCaseDirectiveTypeDefs, upperCaseDirectiveTransformer } = upperCaseDirective("upperCase");
const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective("auth");

// 建立可執行的Schema
let schema = makeExecutableSchema({
    typeDefs: [
        upperCaseDirectiveTypeDefs,
        authDirectiveTypeDefs,
        typeDefs,
    ],
    resolvers,
});

// 加入@upperCase directive轉換邏輯至Schema
schema = upperCaseDirectiveTransformer(schema);
// 加入@auth directive轉換邏輯至Schema
schema = authDirectiveTransformer(schema);

export { typeDefs, resolvers, schema };
