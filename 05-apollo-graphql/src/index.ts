import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import gql from 'graphql-tag'

// 定義Schema
const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`
// 定義資料集
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];

// 定義Resolver
const resolvers = {
  // 所有Query都從這裡進
  Query: {
    books: () => books,
  },
};

// 建立Apollo伺服器實例
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// 啟動Apollo伺服器
const { url } = await startStandaloneServer(server, {
  listen: { port: 3456 },
});

console.log(`🚀  Server ready at: ${url}`);