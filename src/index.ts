import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router } from "./routes/routes";

dotenv.config();

const app = express();

app.use(cors(), json());
app.use(router);

const PORT: number = Number(process.env.PORT);

app.listen(PORT, () => {
    console.log(`The server is up and runnig on port ${PORT}`);
});