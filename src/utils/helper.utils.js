/**
 * @description Common Error class to throw an error from anywhere.
 * The {@link errorHandler} middleware will catch this error at the central place and it will return an appropriate response to the client
 */

class apiError extends Error {
  /**
   *
   * @param {number} statusCode
   * @param {string} message
   * @param {any[]} errors
   * @param {string} stack
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * @class apiResponse
 * @description Represents the structure of API responses with a standardized format.
 */

class apiResponse {
  /**
   * @constructor
   * @param {number} statusCode - HTTP status code of the response.
   * @param {any} data - Data to be included in the response.
   * @param {string} [message='Success'] - Message describing the result of the response.
   */

  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.contact = data || {};
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Example Usage:
// const response = new apiResponse(200, { key: 'value' }, 'Operation successful');
// console.log(response);

/**
 * @function asyncHandler
 * @description Wraps an asynchronous route handler to ensure proper error handling.
 * @param {function} requestHandler - Asynchronous route handler function.
 * @returns {function} Express middleware function with error handling.
 */

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

/* Example Usage:
 *  const asyncRouteHandler = asyncHandler(async (req, res, next) => {
 *      Asynchronous operations
 * });
 * router.get('/example', asyncRouteHandler);
 */

/**
 * The function `sendResponse` sends a JSON response with a specified status code, data, and optional
 * message.
 * @param res - The `res` parameter is typically the response object in Node.js, which is used to send
 * a response back to the client making the request.
 * @param statusCode - The `statusCode` parameter is the HTTP status code that will be sent in the
 * response. It indicates the status of the HTTP request, such as 200 for a successful request, 404 for
 * not found, 500 for server error, etc.
 * @param [data] - The `data` parameter in the `sendResponse` function is used to pass any relevant
 * data that you want to send back in the response. This data could be in the form of an object, array,
 * string, etc., depending on what information you want to include in the response.
 * @param message - The `message` parameter in the `sendResponse` function is a string that represents
 * a message or description related to the response being sent. It can be used to provide additional
 * information or context along with the response data.
 */
const sendResponse = (res, statusCode, data = null, message) => {
  res.status(statusCode).json(new apiResponse(statusCode, data, message));
};

module.exports = {
  apiError,
  apiResponse,
  asyncHandler,
  sendResponse,
};
