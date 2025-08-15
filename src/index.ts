import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { json } from 'express';

import { errorHandler } from './middlewares/errorHandlerMiddleware';
import { router } from './routes/routes';

dotenv.config();

const app = express();

app.use(cors(), json());
app.use(router);
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 4000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`The server is up and running on port ${PORT}`);
  });
}

export { app };
