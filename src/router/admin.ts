import express, { Request, Response } from 'express';
import { AdminType, Admins } from '../models/admin';
import verifyToken from '../middleware/verify-token';
import { validatePwd, validateUsername } from '../helper/validator';
import jwt from 'jsonwebtoken';

const store = new Admins();
const { TOKEN_SECRET = '' } = process.env;

/**
 * The above function is an async function that retrieves data from a store and returns it as a JSON
 * response, with the password field of each item replaced with asterisks.
 * @param {Request} req - The `req` parameter represents the incoming request object, which contains
 * information about the HTTP request made by the client. It includes properties such as the request
 * method, request headers, request body, and query parameters.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the response status,
 * headers, and body. In this code snippet, the `res` object is used to send a JSON response with the
 * results
 */
const index = async (req: Request, res: Response) => {
  try {
    const results = await store.index();
    results.forEach((item) => (item.password = '******'));
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

/**
 * The function "show" retrieves data from a store and returns it as a JSON response, with the password
 * field masked.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body. In this code snippet, it is used to send JSON responses with
 * appropriate status codes and
 * @returns In this code, if the `data` is found, it is returned as a JSON response with the password
 * field masked as "******". If the `data` is not found, a JSON response with a 404 status code and a
 * message "Data not found !!!" is returned. If there is an error during the execution of the code, a
 * JSON response with a 400 status code and
 */
const show = async (req: Request, res: Response) => {
  try {
    const data = await store.show(req.params.id);
    if (!data) {
      res.status(404).json({ message: 'Data not found !!!' });
      return;
    }
    data.password = '******';
    res.json({success: true, data});
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

/**
 * The function creates a new admin user with a username and password, performs validation checks, and
 * returns the created user data with the password hidden.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body. In this code snippet, the `res`
 * object is
 */
const create = async (req: Request, res: Response) => {
  try {
    const payload: AdminType = {
      username: req.body.username,
      password: req.body.password,
      id: undefined,
    };

    if (!payload.username || !payload.password) {
      throw new Error('Username & Password must be required !!!');
    }

    // let validate = validateUsername(data.username);
    // if (validate) {
    //   throw new Error(validate);
    // }

    // validate = validatePwd(data.username);
    // if (validate) {
    //   throw new Error(validate);
    // }

    const data = await store.create(payload);
    data.password = '******';
    res.json({success: true, data});
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

/**
 * The function "authenticate" is an asynchronous function that takes in a request and response object,
 * and it attempts to authenticate a user by checking their username and password against a store. If
 * the authentication is successful, it generates a JSON Web Token (JWT) and sends it back in the
 * response. If there is an error during the authentication process, it sends a 400 status code and an
 * error message in the response.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request method, headers, body, and URL parameters.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, sending JSON data, or redirecting the client to another URL.
 * @returns In this code, if the authentication is successful and a user is found, a JSON response is
 * returned with a token. The token is generated using the `jwt.sign()` function and includes the user
 * object. The response will have a `token` property containing the generated token.
 */
const authenticate = async (req: Request, res: Response) => {
  try {
    const isMatch = await store.authenticate(req.body.username, req.body.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid Username or Password !!!' });
      return;
    }
    const token = jwt.sign({ user: isMatch }, TOKEN_SECRET);
    res.json({ success: true, token });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const adminRoutes = (app: express.Application) => {
  app.get('/admins', verifyToken, index);
  app.get('/admins/:id', verifyToken, show);
  app.post('/admins', verifyToken, create);
  app.post('/admins/login', authenticate);
};

export default adminRoutes;
