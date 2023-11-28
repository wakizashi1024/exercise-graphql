import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { defaultFieldResolver } from "graphql";

// 建立@upperCase directive schema定義及其Transformer
function upperCaseDirective(directiveName) {
    return {
        // Schema custom directive定義
        upperDirectiveTypeDefs: `directive @${directiveName} on FIELD_DEFINITION`,
        // Transformer用於轉換Schema中所有Resolver中含有@upper directive的欄位，將其值轉為大寫
        upperCaseDirectiveTransformer: (schema) => {
            return mapSchema(schema, {
                // Shema中每個物件欄位執行一次
                [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
                    // 取得@upper directive
                    const upperDirective = getDirective(
                        schema,
                        fieldConfig,
                        directiveName
                    )?.[0];
        
                    // 如果該欄位有@upper directive
                    if (upperDirective) {
                        // 取得該欄位的resolver
                        const { resolve = defaultFieldResolver } = fieldConfig;
        
                        // 取代該欄位的resolver為新的resolver(這裡先執行原有的resolver，再將結果轉為大寫)
                        fieldConfig.resolve = async function (
                            source,
                            args,
                            context,
                            info
                        ) {
                            const result = await resolve(source, args, context, info);
                            if (typeof result === "string") {
                                return result.toUpperCase();
                            }
        
                            return result;
                        };
        
                        return fieldConfig;
                    }
                },
            });
        }
    }
}



export { upperCaseDirective };
