import { GraphQLError } from "graphql";

class AuthorizationError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: "UNAUTHORIZED",
            },
        });
        this.name = "AuthorizationError";
    }
}

export { AuthorizationError };