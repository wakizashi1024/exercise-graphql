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

    input UpdateUserInput {
        email: String,
        username: String,
        password: String,
        bio: String,
        image: String,
    }

    type Mutation {
        login(user: LoginInput): UserPayload
        register(user: RegisterInput): UserPayload
        updateUser(user: UpdateUserInput): UserPayload @auth
    }

    type Query {
        foo: String, @auth
        currentUser: User, 
    }
`;

export { typeDefs };
