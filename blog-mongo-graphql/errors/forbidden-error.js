import { GraphQLError } from "graphql";

class ForbiddenError extends GraphQLError {
    constructor(message) {
        super(message, {
            extensions: {
                code: "FORBIDDEN",
            },
        });
        this.name = "ForbiddenError";
    }
}

export { ForbiddenError };