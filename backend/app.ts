import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { jwtAuthen } from "./controller/auth/authen";
import login from "./controller/auth/login";
import register from "./controller/auth/register";
import game from "./controller/game/game";
import user from "./controller/user/user";

export const app = express();

app.use(cors({
    origin: "http://localhost:4200",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders: ["Content-Type","Authorization"]
  }));

app.use(bodyParser.json());

app.use("/api/auth", register);
app.use("/api/auth", login);

app.use(jwtAuthen, (err: any, req: any, res: any, next: any) => {
  if (err.name === "UnauthorizedError") {
    res.status(err.status).send({ message: err.message });
    return;
  }
  next();
});

app.use("/api/user", jwtAuthen, user);
app.use("/api/game", jwtAuthen, game);