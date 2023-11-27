// Mock libraries datasets
const libraries = [
  {
    branch: "downtown",
  },
  {
    branch: "riverside",
  },
]

// Mock books dataset
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
    branch: 'riverside',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
    branch: 'downtown',
  },
]

// schema
const typeDefs = `#graphql
  type Author {
    name: String!
  }
  
  type Book {
    title: String!
    author: Author!
  }

  type Library {
    branch: String!
    books: [Book!]
  }

  type Query {
    libraries: [Library!]
  }
`

// resolvers
const resolvers = {
  Query: {
    libraries: (parent, args, context, info) => {
      console.log(context)

      return libraries
    },
  },
  Library: {
    // 透過資料來源(books dataset)的branch屬性來找出該Library相對應的books
    books: (parent, args, context, info) => {
      console.log(context)

      books.filter(book => book.branch === parent.branch)
    }
  },
  Book: {
    // 因為資料來源(books dataset)的author欄位儲存的是字串，但Schema內宣告的欄位類別是物件型別(Author)
    // 所以這裡要定義author欄位的處理方式(返回物件)
    author: (parent, args, context, info) => {
      console.log(context)

      return { 
        name: parent.author 
      }
    }
  }
  // 因為Book schema的author屬性只有name，而name是基本型別String(會直接被解析)，所以不用另外定義Author
}

export { typeDefs, resolvers }
