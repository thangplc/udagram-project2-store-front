import express, { Request, Response } from 'express';
import verifyToken from '../middleware/verify-token';
import { OrderType, Orders } from '../models/order';

const store = new Orders();

const index = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const status = ((req.query.status || '') as string).toLowerCase();

    if (!userId) {
      res
        .status(404)
        .json({ success: false, message: 'userId is required !!!' });
      return;
    }

    if (status && !['active', 'completed'].includes(status)) {
      res.status(400).json({
        success: false,
        message: "Status must be ['active', 'completed']",
      });
      return;
    }
    const results = await store.index(userId, status);

    res.json({ success: true, data: results });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    if (!userId) {
      res.status(404).json({ message: 'userId is required !!!' });
      return;
    }

    const data = await store.show(parseInt(userId), parseInt(id));
    if (!data) {
      res.status(404).json({ message: 'Data not found !!!' });
      return;
    }

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const payload: OrderType = {
      items: req.body.items,
      user_id: parseInt(req.params.userId),
      status: 'active',
    };

    if (!payload.user_id) {
      res.status(404).json({ message: 'userId is required !!!' });
      return;
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
    const { id, userId } = req.params;
    if (!userId) {
      res.status(404).json({
        success: false,
        message: 'userId is required !!!',
      });
      return;
    }
    const deleted = await store.delete(parseInt(userId), parseInt(id));
    res.json({
      success: true,
      deleted,
    });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const addProduct = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  const { product_id, quantity } = req.body;

  if (!userId) {
    res.status(404).json({
      success: false,
      message: 'userId is required !!!',
    });
    return;
  }

  if (!id) {
    res
      .status(400)
      .json({ success: false, message: 'orderId is required !!!' });
    return;
  }

  if (!product_id) {
    res
      .status(400)
      .json({ success: false, message: 'product_id is required !!!' });
    return;
  }

  if (quantity <= 0) {
    res
      .status(400)
      .json({
        success: false,
        message: 'quantity is required and more than 0 !!!',
      });
    return;
  }

  try {
    const addedProduct = await store.addProduct(
      parseInt(userId),
      parseInt(id),
      product_id,
      quantity
    );
    res.json({ success: true, data: addedProduct });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const completeOrder = async (req: Request, res: Response) => {
  const { id, userId } = req.params;
  if (!userId) {
    res.status(404).json({ success: false, message: 'userId is required !!!' });
    return;
  }
  if (!id) {
    res
      .status(400)
      .json({ success: false, message: 'orderId is required !!!' });
    return;
  }

  try {
    const addedProduct = await store.completeOrder(
      parseInt(userId),
      parseInt(id)
    );
    res.json({ success: true, data: addedProduct });
  } catch (err) {
    res.status(400);
    res.json({ success: false, message: `${err}` });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/users/:userId/orders', verifyToken, index);
  app.get('/users/:userId/orders/:id', verifyToken, show);
  app.post('/users/:userId/orders', verifyToken, create);
  app.post('/users/:userId/orders/:id/products', verifyToken, addProduct);
  app.post('/users/:userId/orders/:id/complete', verifyToken, completeOrder);
  app.delete('/users/:userId/orders/:id', verifyToken, destroy);
};

export default orderRoutes;
