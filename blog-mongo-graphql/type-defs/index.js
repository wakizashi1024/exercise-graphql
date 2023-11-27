const typeDefs = `#graphql
    type User {
        email: String!
        username: String!
        bio: String
        image: String
        token: String
    }

    type UserPayload {
        user: User
    }
    
    input LoginInput {
        email: String!
        password: String!   
    }

    input RegisterInput {
        username: String!
        email: String!
        password: String!
    }

    type Query {
        foo: String,
        currentUser: User, 
    }

    type Mutation {
        login(user: LoginInput): UserPayload
        register(user: RegisterInput): UserPayload
    }
`;

export { typeDefs };
