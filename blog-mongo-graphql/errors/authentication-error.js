import { GraphQLError } from "graphql";

class AuthenticationError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: "UNAUTHENTICATED",
            },
        });
        this.name = "AuthenticationError";
    }
}

export { AuthenticationError };