import express from 'express';
import jwt from 'jsonwebtoken';

const { TOKEN_SECRET = '' } = process.env;

/**
 * The function `verifyToken` is used to check the validity of a token in an HTTP request and allows
 * the request to proceed if the token is valid, otherwise it returns an error message.
 * @param req - The `req` parameter is an object that represents the HTTP request made by the client.
 * It contains information such as the request headers, request body, request method, request URL, and
 * more.
 * @param res - The `res` parameter is the response object in Express.js. It is used to send the
 * response back to the client.
 * @param {Function} next - The `next` parameter is a function that is used to pass control to the next
 * middleware function in the request-response cycle. It is typically called at the end of the
 * `verifyToken` function to indicate that the token has been successfully verified and the request can
 * proceed to the next middleware or route handler
 * @returns In the catch block, the function is returning a response with a status code of 401 and a
 * JSON message of 'Access Denied, Invalid Token !!!'.
 */
const verifyToken = (
  req: express.Request,
  res: express.Response,
  // eslint-disable-next-line @typescript-eslint/ban-types
  next: Function
): void => {
  try {
    const authorizationHeader = req.headers.authorization || ' ';
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, TOKEN_SECRET);
    next();
  } catch (err) {
    res.status(401);
    res.json('Access Denied, Invalid Token, Please use valid token !!!');
    return;
  }
};

export default verifyToken;
