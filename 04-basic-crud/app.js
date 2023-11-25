const { graphql, buildSchema } = require('graphql')
const express = require('express')
const { graphqlHTTP } = require('express-graphql') 
const cors = require('cors')

// 模擬資料表artiles
const articles = [
    { id: 1, title: "First artitle", content: 'Hello World' },
    { id: 2, title: "Second artitle", content: 'Vanish this world' },
    { id: 3, title: "Thirdartitle", content: 'Goodbye World' },
]

// 初始化Express
const app = express()

// 允許跨網域請求
app.use(cors())

// 使用GraphQL Schema語法建立schema
const schema = buildSchema(`
    type Article {
        id: ID!,
        title: String!,
        content: String!
        tagList: [String!]
    }

    # 查詢進入點
    type Query {
        articles: [Article]
        article(id: ID!): Article
    }

    # 參數物件必須以input定義
    input CreateArticleInput {
        title: String!
        content: String!
        tagList: [String!]
    }
    input UpdateArticleInput {
        title: String!
        content: String!
        tagList: [String!]
    }

    type DeleteStatus {
        success: Boolean!
    }

    # 修改進入點
    type Mutation {
        createArticle(article: CreateArticleInput): Article
        updateArticle(id: ID!, article: UpdateArticleInput): Article
        deleteArticle(id: ID!): DeleteStatus
    }
`)

// 定義schma的resolver
const rootValue = {
    articles: () => {
        return articles
    },
    article: ({ id }) => {
        return articles.find(article => article.id == id)
    },
    createArticle: ({ article: createArticle }) => {
        const nextId = articles.sort((a, b) => a.id - b.id).at(-1).id + 1
        createArticle.id = nextId
        articles.push(createArticle)

        return createArticle
    },
    updateArticle: ({ id, article: updateArticle }) => {
        const targetArticleIndex = articles.findIndex(article => article.id == id)
        if (targetArticleIndex == -1) {
            return null
        }
        else {
            const targetArticle = articles[targetArticleIndex]
            targetArticle.title = updateArticle.title ?? targetArticle.title
            targetArticle.content = updateArticle.content ?? targetArticle.content
            targetArticle.tagList = updateArticle.tagList ?? targetArticle.tagList
            
            articles[targetArticleIndex] = targetArticle
            return targetArticle
        }
    },
    deleteArticle: ({id}) => {
        const targetArticleIndex = articles.findIndex(article => article.id == id)
        if (targetArticleIndex == -1) {
            return {
                success: false,
            }
        }
        else {
            articles.splice(targetArticleIndex, 1)
        }

        return {
            success: true,
        }
    }
}

// // 查詢schema
graphql({
    schema, 
    source: `{
        article(id: "2") {
            id,
            title,
            content
        }
    }`, 
    rootValue
}).then((result) => {
    console.log(result);
})

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