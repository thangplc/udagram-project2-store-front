import db from '../db';

export type ProductType = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

export class Products {
  /**
   * The function retrieves all products from a database table and returns them as an array of
   * ProductType objects.
   * @returns a Promise that resolves to an array of ProductType objects.
   */
  async index(): Promise<ProductType[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could not get Product. ${err}`);
    }
  }

  /**
   * The function retrieves a product from the database based on its ID and returns it.
   * @param {number} id - The `id` parameter is a number that represents the unique identifier of a
   * product. It is used to query the database and retrieve the product with the matching id.
   * @returns a Promise that resolves to a value of type ProductType.
   */
  async show(id: number): Promise<ProductType> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find Product ${id}. ${err}`);
    }
  }

  /**
   * The function creates a new product in the database and returns the created product.
   * @param {ProductType} b - The parameter `b` is of type `ProductType`.
   * @returns a Promise that resolves to a ProductType object.
   */
  async create(b: ProductType): Promise<ProductType> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await db.connect();

      const result = await conn.query(sql, [b.name, b.price, b.category]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not add new Product ${b.name}. ${err}`);
    }
  }

  /**
   * The function deletes a product from the database based on its ID.
   * @param {number} id - The `id` parameter is the unique identifier of the product that you want to
   * delete from the database.
   * @returns a Promise that resolves to a value of type ProductType.
   */
  async delete(id: number): Promise<ProductType> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await db.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not delete Product ${id}. ${err}`);
    }
  }
}
