const { ValidationError, UniqueConstraintError, DatabaseError } = require('sequelize');
const { logger } = require("../loggers/winston.logger.js");
const { apiError, asyncHandler } = require("../utils/helper.utils.js");

/**
 *
 * @param {Error | ApiError} err
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 *
 *
 * @description This middleware is responsible to catch the errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV !== "PROD") {
        console.log(err);
    }
    let error = err;

    // Check if the error is an instance of an ApiError class which extends native Error class
    if (!(error instanceof apiError)) {
        // Assign an appropriate status code
        let statusCode = error.statusCode || 500;

        if (err instanceof UniqueConstraintError) {
            const errorFields = Object.keys(err.fields).join(",");
            err.message = `Duplicate field(s) - ${errorFields}`;
            statusCode = 400;
        } else if (err instanceof ValidationError) {
            err.message = err.errors.map(e => e.message).join(', ');
            statusCode = 400;
        } else if (err instanceof DatabaseError) {
            err.message = 'Database error';
            statusCode = 400;
        } else if (err.name === "SequelizeForeignKeyConstraintError") {
            err.message = `Foreign key constraint error: ${err.index}`;
            statusCode = 400;
        }

        // Set a message from the native Error instance or a custom one
        const message = error.message || "Something went wrong";
        error = new apiError(
            statusCode,
            message,
            error?.errors || [],
            err.stack,
        );
    }

    // Now we are sure that the `error` variable will be an instance of ApiError class
    const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV === "development"
            ? { stack: error.stack }
            : {}), // Error stack traces should be visible in development for debugging
    };

    logger.error(`${error.message}`);

    // Send error response
    return res.status(error.statusCode).json(response);
};

module.exports = { errorHandler };
