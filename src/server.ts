import * as dotenv from 'dotenv';
// Config env for the top-first project
dotenv.config();

import express, { Request, Response } from 'express';
import adminRoutes from './router/admin';
import userRoutes from './router/user';
import productRoutes from './router/product';
import orderRoutes from './router/order';

if (!process.env.PORT) {
  process.exit(1);
}

const port: number = parseInt(process.env.PORT as string, 10);
const host: string = process.env.POSTGRES_HOST as string;

const app = express();
app.use(express.json());

adminRoutes(app);
userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.get('/', function (req: Request, res: Response) {
  res.send('Hello ThangPLC!');
});

app.listen(port, function () {
  console.log(`Starting app on port: http://${host}:${port}`);
});

export default app;
