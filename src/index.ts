import express from "express";
import { router } from "./router";

const app = express();

app.use(router);

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server started");
});