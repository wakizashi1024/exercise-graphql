const { graphql, buildSchema } = require('graphql')
const express = require('express')
const { graphqlHTTP } = require('express-graphql') 
const cors = require('cors')

// 初始化Express
const app = express()

// 允許跨網域請求
app.use(cors())

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

// // 查詢schema
// graphql({
//     schema, 
//     source: "{ count, foo }", 
//     rootValue}).then((result) => {
//     console.log(result);
// })

// 掛載GraphQL中間件
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true // 開啟GraphiQL(GraphQL編輯器)
}))

// 啟動Web服務
app.listen(3456, "localhost", () => {
    console.log('Server is running on http://localhost:3456/');
})