import Promise from "bluebird";
import express from "express";
import bodyParser from "body-parser";
import app_routes from "./services/routes/app_routes.js";
import { expire_inactive_tokens } from "./services/status.js";

import sharp from "sharp";
import fs from "fs";

import __dirname from "./modules/__dirname.js";

import link_express_to_socket from "./services/express_to_socket_io.js";
import nocache from "nocache";
import dot from "dotenv";

const env = dot.config().parsed;
const root_dir = __dirname().slice(0, __dirname().lastIndexOf("/"));

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

export async function server_start() {
  // app.use(express.favicon());
  // app.use(expressLogging({extended: false}))

  const app = express();
  const port = process.env.PORT || env.Port || 8080;

  if (port === "8080") {
    app.set("etag", false);
    app.use((req, res, next) => {
      res.set("Cache-Control", "no-store");
      next();
    });
    app.disable("view cache");
    app.use(nocache());
  }

  app.use(jsonParser);
  app.use(urlencodedParser);
  app.use(express.json({ extended: false }));

  app.use(
    express.static("./public", {
      maxAge: "10", // uses milliseconds per docs
    })
  );

  app_routes(app);

  await link_express_to_socket(app, port);
  // app.listen(port, () => {
  //   console.log(`Listening on ${port}`);
  // })

  expire_inactive_tokens();
}

server_start();
