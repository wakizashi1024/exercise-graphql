// Mock dataset
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
]

// schema
const typeDefs = `#graphql
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`

// resolvers
const resolvers = {
    Query: {
        books: () => books,
    },
}

export { typeDefs, resolvers }