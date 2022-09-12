import "express-async-errors";
import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";
import { errorHandler } from "./middlewares/errorHandlerMiddleware";

dotenv.config();

const app = express();

app.use(cors(), json());
app.use(router);
app.use(errorHandler);

const PORT: number = Number(process.env.PORT) || 4001;

app.listen(PORT, () => {
    console.log(`The server is up and runnig on port ${PORT}`);
});