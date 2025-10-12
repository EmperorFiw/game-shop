import express from "express";
import http from "http";
import path from "path";
import { app } from "./app";

const port = process.env.port || 7777;
const server = http.createServer(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.get("/", (req, res) => {
	res.status(200).send({ message: "hello game shop" });
});
server.listen(port, () => {
    console.log(`🚀 Server is started on port ${port}`);
    console.log(`📂 Serving uploads from: ${path.join(__dirname, "uploads")}`);
},).on("error", (error) => {
    console.error(error);
})