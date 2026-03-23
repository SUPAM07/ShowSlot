"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, res, next) => {
    try {
        // Parse the full request object {body, query, params} to match Zod schema structure
        const parsed = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        req.body = parsed.body;
        if (parsed.query)
            req.query = parsed.query;
        if (parsed.params)
            req.params = parsed.params;
        next();
    }
    catch (error) {
        // Passing the error to next() triggers your global error handler
        next(error); // global error handler takes care of formatting the Zod error
    }
};
exports.validate = validate;
