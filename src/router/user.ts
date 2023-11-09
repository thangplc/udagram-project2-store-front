import express, { Request, Response } from 'express';
import { validatePwd, validateUsername } from '../helper/validator';
import verifyToken from '../middleware/verify-token';
import { UserType, Users } from '../models/user';

const store = new Users();

const index = async (_req: Request, res: Response) => {
  try {
    const results = await store.index();
    results.forEach((t) => (t.password = '******'));
    res.json({success: true, results});
  } catch (err) {
    res.status(400);
    res.json({ success: false,message: `${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const data = await store.show(parseInt(req.params.id));
    if (!data) {
      res.status(404).json({ success: false,message: 'Data not found !!!' });
      return;
    }
    data.password = '******';
    res.json(data);
  } catch (err) {
    res.status(400);
    res.json({ success: false,message: `${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const payload: UserType = {
      username: req.body.username,
      password: req.body.password,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    };

    if (
      !payload.username ||
      !payload.password ||
      !payload.first_name ||
      !payload.last_name
    ) {
      throw new Error(
        'username, password, first_name and last_name must be required'
      );
    }

    // let validate = validateUsername(payload.username);
    // if (validate) {
    //   throw new Error(validate);
    // }

    // validate = validatePwd(payload.password);
    // if (validate) {
    //   throw new Error(validate);
    // }

    const data = await store.create(payload);
    data.password = '******';
    res.json({
      success: true, data
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const _delete = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id));
    res.json({success: true, deleted});
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', verifyToken, index);
  app.get('/users/:id', verifyToken, show);
  app.post('/users', verifyToken, create);
  app.delete('/users/:id', verifyToken, _delete);
};

export default userRoutes;
