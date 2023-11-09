import express, { Request, Response } from 'express';
import verifyToken from '../middleware/verify-token';
import { ProductType, Products } from '../models/product';

const store = new Products();

const index = async (req: Request, res: Response) => {
  try {
    const results = await store.index();
    res.json({ success: true, results });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const data = await store.show(parseInt(req.params.id));
    if (!data) {
      res.status(404).json({ success: false, message: 'Data not found !!!' });
      return;
    }
    res.json({
      success: false,
      data,
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const payload: ProductType = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
    };

    if (!payload.name || !payload.price) {
      throw new Error('Name and Price must be required !!!');
    }

    if (payload.price < 0) {
      throw new Error('Price must be more than or equal 0 !!!');
    }

    const data = await store.create(payload);
    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(parseInt(req.params.id));
    res.json({ success: true, deleted });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyToken, create);
  app.delete('/products/:id', verifyToken, destroy);
};

export default productRoutes;
