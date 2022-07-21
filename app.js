import Promise from "bluebird"
import express from "express"
import bodyParser from 'body-parser'
import { login, update_user, signup } from "./api/database/db.js"
import { status } from "./status.js"
import { expire_inactive_tokens } from "./status.js";
import multer from "multer"
import sharp from "sharp"
import fs from "fs"

import __dirname from './modules/__dirname.js'
import search from './modules/search.js'
import { html_auth } from './html_auth.js'
import link_express_to_socket from "./link_express_to_socket.js"
import nocache from 'nocache';
import dot from 'dotenv';
const env = dot.config().parsed;
const root_dir = __dirname().slice(0, __dirname().lastIndexOf("/"));



const fileSystem = Promise.promisifyAll(fs);

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const upload = multer({
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return
      cb(new Error('Please upload a valid image file'))
    }
    cb(undefined, true)
  }
})


export async function server_start() {
  // app.use(express.favicon());
  // app.use(expressLogging({extended: false}))
  const index = await fileSystem.readFileAsync("./client/index.html", { encoding: "utf8" })
  const app = express();
  const port = process.env.PORT || env.Port || 8080;

  if (port === '8080') {
    app.set('etag', false)
    app.use((req, res, next) => {
      res.set('Cache-Control', 'no-store')
      next()
    })
    app.disable('view cache');
    app.use(nocache())
  }


  app.use(jsonParser);
  app.use(urlencodedParser);
  app.use(express.json({ extended: false }))

  app.use(express.static("./client", {
    maxAge: '10' // uses milliseconds per docs
  }))
  app.use(express.static("./client/client_javascript"))
  app.use(express.static("./node_modules/socket.io/client-dist"))
  app.use(express.static("./node_modules/axios/dist"))

  app.use(express.static("./node_modules/bootstrap-icons/font"));
  app.get("/", (req, res) => {
    res.status(200).sendFile("./client/index.html")
  })


  app.put("/image", upload.array('files'), async (req, res) => {

    const files = req.files
    while (files.length) {
      try {
        const file = files.shift()
        await sharp(file.buffer).resize({ width: 250, height: 250 }).png().toFile(__dirname() + `/images/${file.originalname}`)
        res.status(201).send('Image uploaded successful')
      } catch (error) {
        console.log(error)
        res.status(400).send(error)
      }
    }
  })





  app.get("*.html/:token", html_auth)

  app.get("/search/:api/:word/:limit", search);

  app.post("/login", login);

  app.post("/signup", signup);

  app.put("/update_user", update_user);

  app.get("/status/:user_token/", status);
  await link_express_to_socket(app, port)
  // app.listen(port, () => {
  //   console.log(`Listening on ${port}`);
  // })

  expire_inactive_tokens();
}

server_start();