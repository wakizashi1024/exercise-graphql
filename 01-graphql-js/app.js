const { graphql, buildSchema } = require('graphql')

// 使用GraphQL Schema語法建立schema
const schema = buildSchema(`
    type Query {
        foo: String,
        count: Int,
    }
`)

// 定義schma的resolver
const rootValue = {
    foo: () => {
        return "bar";
    },
    count: () => {
        return 666;
    }
}

// 查詢schema
graphql({
    schema, 
    source: "{ count, foo }", 
    rootValue
}).then((result) => {
    console.log(result);
})