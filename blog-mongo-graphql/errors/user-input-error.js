import { GraphQLError } from "graphql";
import { ApolloServerErrorCode } from "@apollo/server/errors";

class UserInputError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: ApolloServerErrorCode.BAD_USER_INPUT,
            },
        });
        this.name = "UserInputError";
    }
}

export { UserInputError };
