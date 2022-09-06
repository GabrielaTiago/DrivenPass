import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors(), json());


const PORT: number = +process.env.PORT;

app.listen(PORT, () => {
    console.log(`The server is up and runnig on port ${PORT}`)
});