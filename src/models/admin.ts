import db from '../db';
import bcrypt from 'bcrypt';

const { PASSWORD_SECRET, SALT_ROUND = '10' } = process.env;

export type AdminType = {
  id?: number;
  username: string;
  password: string;
};

const querySQL = {
  findAll: 'SELECT * FROM admins',
  findById: 'SELECT * FROM admins WHERE id=($1)',
  findByUsername: 'SELECT * FROM admins WHERE username=($1)',
  insert: 'INSERT INTO admins (username, password) VALUES($1, $2) RETURNING *'
}

export class Admins {
  /**
   * The function retrieves all admin records from the database and returns them as an array of
   * AdminType objects.
   * @returns a Promise that resolves to an array of objects of type AdminType.
   */
  async index(): Promise<AdminType[]> {
    try {
      const conn = await db.connect();

      const result = await conn.query(querySQL.findAll);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`Could NOT get admins. ${err}`);
    }
  }

  /**
   * The function retrieves an admin record from a database based on the provided ID.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
   * admin you want to retrieve from the database.
   * @returns a Promise that resolves to an object of type AdminType.
   */
  async show(id: string): Promise<AdminType> {
    try {
      const conn = await db.connect();

      const result = await conn.query(querySQL.findById, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could NOT find admins ${id}. ${err}`);
    }
  }

  /**
   * The function creates a new admin by checking if the admin already exists and then inserting the
   * admin into the database.
   * @param {AdminType} b - The parameter `b` is of type `AdminType`.
   * @returns The function `create` returns a Promise that resolves to an `AdminType` object.
   */
  async create(b: AdminType): Promise<AdminType> {
    try {
      const conn = await db.connect();

      const result = await conn.query(querySQL.findByUsername, [b.username]);

      if (result.rows.length > 0) {
        throw new Error(`Exist admin with Username ${b.username}`);
      }

      conn.release();
    } catch (err) {
      throw new Error(`Could NOT add new admin ${b.username}. ${err}`);
    }

    try {
      const conn = await db.connect();
      const hash = await bcrypt.hash(
        b.password + PASSWORD_SECRET,
        parseInt(SALT_ROUND)
      );
      const result = await conn.query(querySQL.insert, [b.username, hash]);

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could NOT add new admins ${b.username}. ${err}`);
    }
  }

  /**
   * The function `authenticate` takes a username and password as parameters, connects to a database,
   * retrieves a user with the given username, compares the password with the stored password using
   * bcrypt, and returns the user if the passwords match, otherwise it returns null.
   * @param {string} username - A string representing the username of the admin trying to authenticate.
   * @param {string} password - The `password` parameter is a string that represents the password
   * provided by the user for authentication.
   * @returns The function `authenticate` returns a Promise that resolves to either an `AdminType`
   * object, `undefined`, or `null`.
   */
  async authenticate(
    username: string,
    password: string
  ): Promise<AdminType | undefined | null> {
    try {
      const conn = await db.connect();

      const result = await conn.query(querySQL.findByUsername, [username]);
      conn.release();
      if (result.rows.length) {
        const user = result.rows[0];

        if (bcrypt.compareSync(password + PASSWORD_SECRET, user?.password)) {
          return user;
        }
      } else {
        return null;
      }
    } catch (err) {
      throw new Error(
        `Could NOT Authenticate Admin ${username}. Error: ${err}`
      );
    }
  }
}
