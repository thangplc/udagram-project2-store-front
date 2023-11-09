import db from '../db';
import { OrderProductType } from './order-product';

export type OrderType = {
  id?: number;
  items?: OrderProductType[];
  user_id: number;
  status: 'active' | 'completed';
};

export class Orders {
  /**
   * The function retrieves orders from the database based on the user ID and status, and also
   * retrieves the associated order items.
   * @param {number} userId - The `userId` parameter is a number that represents the ID of the user for
   * whom we want to retrieve orders.
   * @param {string} status - The `status` parameter is a string that represents the status of the
   * orders to be retrieved. It can have two possible values: "active" or "completed". If the status is
   * "active", the function will retrieve orders that are currently active. If the status is
   * "completed", the function will
   * @returns an array of Order objects.
   */
  async index(userId: number, status: string): Promise<OrderType[]> {
    try {
      const conn = await db.connect();
      let sql = 'SELECT * FROM orders where user_id=($1)';
      const params: unknown[] = [userId];
      if (['active', 'completed'].includes(status)) {
        sql += ' AND status=($2)';
        params.push(status);
      }

      const result = await conn.query(sql, params);
      const orderProductSql =
        'SELECT * FROM order_products WHERE order_id=($1)';
      for (const order of result.rows) {
        const orderItems = await conn.query(orderProductSql, [order.id]);
        order.items = orderItems.rows;
      }

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could NOT get Order. Error: ${err}`);
    }
  }

  /**
   * The function retrieves an order and its associated items from a database based on the provided
   * user ID and order ID.
   * @param {number} userId - The `userId` parameter is the ID of the user for whom we want to retrieve
   * the order. It is a number that uniquely identifies a user in the system.
   * @param {number} orderId - The `orderId` parameter is the unique identifier of the order that you
   * want to retrieve. It is used to query the database and find the order with the matching ID.
   * @returns The `show` function is returning a Promise that resolves to an `Order` object.
   */
  async show(userId: number, orderId: number): Promise<OrderType> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1) and user_id=($2)';
      const conn = await db.connect();

      const result = await conn.query(sql, [orderId, userId]);
      const orderProductSql =
        'SELECT * FROM order_products WHERE order_id=($1)';

      if (result.rows.length > 0) {
        const orderItems = await conn.query(orderProductSql, [
          result.rows[0].id,
        ]);
        result.rows[0].items = orderItems.rows;
      }
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT find Order ${orderId}. Error: ${err}`);
    }
  }

  /**
   * The function creates a new order in the database, including the order details and associated
   * products.
   * @param {Order} b - The parameter `b` is an object of type `Order`.
   * @returns a Promise that resolves to an Order object.
   */
  async create(b: OrderType): Promise<OrderType> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await db.connect();

      const result = await conn.query(sql, [b.user_id, b.status]);

      const data = result.rows[0];

      if (b?.items && b?.items?.length > 0) {
        const sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
        for (const item of b.items) {
          await conn.query(sql, [item.quantity, data.id, item.product_id]);
        }
      }

      conn.release();

      return data;
    } catch (err) {
      throw new Error(`Could NOT add new Order. Error: ${err}`);
    }
  }

  /**
   * The function deletes an order and its associated items from the database.
   * @param {number} userId - The `userId` parameter is the ID of the user who owns the order that
   * needs to be deleted.
   * @param {number} orderId - The `orderId` parameter is the unique identifier of the order that needs
   * to be deleted.
   * @returns a Promise that resolves to an Order object.
   */
  async delete(userId: number, orderId: number): Promise<OrderType> {
    try {
      const conn = await db.connect();

      const sql = 'DELETE FROM orders WHERE id=($1) AND user_id=($2)';
      const deleteItemsSql = 'DELETE FROM order_products WHERE order_id=($1)';

      await conn.query(deleteItemsSql, [orderId]);
      const result = await conn.query(sql, [orderId, userId]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT delete Order ${orderId}. Error: ${err}`);
    }
  }

  /**
   * The `addProduct` function adds a product to an order, updating the quantity if the product already
   * exists in the order.
   * @param {number} userId - The `userId` parameter is the ID of the user who is placing the order.
   * @param {number} orderId - The `orderId` parameter is the ID of the order to which the product will
   * be added.
   * @param {number} productId - The ID of the product that you want to add to the order.
   * @param {number} quantity - The quantity parameter represents the number of units of the product
   * that you want to add to the order.
   * @returns The function `addProduct` returns a Promise that resolves to an `OrderProductType`
   * object.
   */
  async addProduct(
    userId: number,
    orderId: number,
    productId: number,
    quantity: number
  ): Promise<OrderProductType> {
    try {
      const ordersql = 'SELECT * FROM orders WHERE id=($1) AND user_id=($2)';
      const conn = await db.connect();

      const result = await conn.query(ordersql, [orderId, userId]);

      const order = result.rows[0];

      if (order.status !== 'active') {
        throw new Error(
          `1. Could NOT add product ${productId} to order ${orderId} because order status is ${order.status}`
        );
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const conn = await db.connect();
      const checkItemSql =
        'SELECT * FROM order_products WHERE order_id=($1) AND product_id=($2)';
      const itemsResult = await conn.query(checkItemSql, [orderId, productId]);
      const existItem = itemsResult.rows[0];

      if (!existItem) {
        const sql =
          'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';

        const result = await conn.query(sql, [quantity, orderId, productId]);
        conn.release();

        return result.rows[0];
      } else {
        const sql =
          'UPDATE order_products SET quantity=($1) WHERE order_id=($2) AND product_id=($3) RETURNING *';

        const newQuantity = quantity + existItem.quantity;

        const result = await conn.query(sql, [newQuantity, orderId, productId]);
        conn.release();

        return result.rows[0];
      }
    } catch (err) {
      throw new Error(
        `2. Could NOT add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }

  /**
   * The `completeOrder` function completes an order by updating its status to "completed" in the
   * database.
   * @param {number} userId - The `userId` parameter is the ID of the user who placed the order. It is
   * used to verify that the user has the permission to complete the order.
   * @param {number} orderId - The `orderId` parameter is the unique identifier of the order that needs
   * to be completed. It is a number that identifies a specific order in the database.
   * @returns a Promise that resolves to an Order object.
   */
  async completeOrder(userId: number, orderId: number): Promise<OrderType> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1) AND user_id=($2)';
      const conn = await db.connect();

      const result = await conn.query(sql, [orderId, userId]);

      const order = result.rows[0];
      if (!order) {
        throw new Error(`Cannot find Order ${orderId}`);
      }
      if (order.status !== 'active') {
        throw new Error(`Cannot complete Order ${orderId}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`${err}`);
    }

    try {
      const status = 'completed';
      const sql =
        'UPDATE orders SET status=($1) WHERE id=($2) AND user_id=($3) RETURNING *';
      const conn = await db.connect();

      const result = await conn.query(sql, [status, orderId, userId]);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot complete Order ${orderId}: ${err}`);
    }
  }
}
