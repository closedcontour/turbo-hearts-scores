import * as bodyParser from "body-parser";
import * as express from "express";
import * as fs from "fs";
import * as http from "http";
import * as Knex from "knex";
import { Model } from "objection";
import * as path from "path";
import { getRouter } from "./restApi";

const assetDir = path.join(__dirname, "../assets");
const knexConfigPath = path.join(process.cwd(), "knexfile.json");

const rawDbConfig = fs.readFileSync(knexConfigPath).toString("utf8");
const dbConfig = JSON.parse(rawDbConfig);
const knex = Knex(process.env.PROD ? dbConfig.production : dbConfig.development);

knex.migrate.latest({
  directory: path.join(__dirname, "migrations"),
});

Model.knex(knex);

const app = express();
const server = http.createServer(app);

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
  );
  next();
});

app.use(express.static(assetDir));
app.use("/api", bodyParser.urlencoded({ extended: true }));
app.use("/api", bodyParser.json());
app.use("/api", getRouter());

app.use("/", (req, res, next) => {
  // uri has a forward slash followed any number of any characters except full stops (up until the end of the string)
  if (/\/[^.]*$/.test(req.url)) {
    res.sendFile(path.join(assetDir, "index.html"));
  } else {
    next();
  }
});

// start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port ${server.address().port} :)`);
});
