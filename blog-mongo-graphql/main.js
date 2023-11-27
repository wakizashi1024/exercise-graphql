// import "dotenv/config.js";
import "./import-config.js";
// console.log(process.env.NODE_ENV);

// import { graphql } from "graphql";
import express from "express";
import http from "http";
import cors from "cors";
import chalk from "chalk";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import { typeDefs, resolvers } from "./schema.js";
import dataSources from "./data-sources/index.js";

// 建立Express實例
const app = express();

// 將Express實例包裝為Http伺服器實例
const httpServer = http.createServer(app);

// 建立ApolloServer實例
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

// 啟動ApolloServer
await apolloServer.start();

// 註冊Express中間件
app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ 
            token: req.headers.authorization?.replace("Bearer ", ""),
            dataSources: dataSources,
        }),
    })
);

// 啟動Http伺服器
const { url, error } = await new Promise((resolve, reject) => {
    httpServer.listen(
        { hostname: process.env.HTTP_HOST, port: process.env.HTTP_PORT },
        () => {
            try {
                const { address, port } = httpServer.address();
                const hostname =
                    address === "" || address === "::" ? "localhost" : address;

                resolve({
                    url: `http://${hostname}:${port}`,
                });
            } catch (err) {
                reject(err);
            }
        }
    );
}).catch((err) => {
    return {
        error: err,
    };
});

// 顯示伺服器啟動狀態
if (url && !error) {
    console.log(chalk.green(`🚀 Server ready at ${url}`));
    console.log(chalk.yellow(`    Apollo Server: ${url}/graphql`));
} else {
    console.error(chalk.red(`Error while starting server: ${error}`));
}
