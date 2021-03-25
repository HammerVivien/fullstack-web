import express from "express";
import { mikroorm } from "./entities";
import mikroOrmConfig from "./mikro-orm.config";
import { controllers } from "./controllers";
import bodyParser from "body-parser";




const app = express();

app.use(bodyParser.json());
app.use(mikroorm(mikroOrmConfig));
app.use(controllers);

app.get("/", function(req, res) {
    res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server started");
});