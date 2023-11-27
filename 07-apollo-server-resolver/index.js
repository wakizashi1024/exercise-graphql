import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer'
import cors from 'cors'
import express from 'express'
import http from 'http'

import { typeDefs, resolvers } from './schema.js'

// 建立Express伺服器實例
const app = express()

// 將Express實例包裝成Http伺服器實例
const httpServer = http.createServer(app)

// 建立Apollo伺服器實例並指定Plugin掛載至httpServer
const apolloServer = new ApolloServer({
    typeDefs, // Schema
    resolvers, // Resolvers
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
})

// 啟動Apollo伺服器
await apolloServer.start();

// 註冊Express中間件
app.use(
    '/graphql',
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ token: req.headers.token }),
    }),
)

// 啟動Http伺服器
await new Promise(resolve => httpServer.listen({ port: 3456 }, resolve))

const { address, port } = httpServer.address()
const hostname = address === '' || address === '::' ? 'localhost' : address
console.log(`🚀 Server ready at http://${hostname}:${port}/graphql`)

