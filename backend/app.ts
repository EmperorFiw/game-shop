import bodyParser from "body-parser";
import express from "express";

export const app = express();
app.use(bodyParser.json());

// app.use("/", index);
