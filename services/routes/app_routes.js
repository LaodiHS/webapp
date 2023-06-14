import search from "../../modules/search.js";
import file_system_tools from "../../modules/file_system.js";
import { html_auth } from "../html_auth.js";
import { login, update_user, signup } from "../database/db.js";
import { status } from "../status.js";

import multer from "multer";
import static_file_routes from "./static_file_routes.js";
const { file_system } = file_system_tools();

const upload = multer({
  limits: { fileSize: 10000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return;
      cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});
export default async function app_routes(app) {
  app.use(express.json());
  const index = await file_system.readFileAsync("./public/index.html", {
    encoding: "utf8",
  });

  static_file_routes(app);

  app.get("/", (req, res) => {
    res.status(200).sendFile("./public/index.html");
  });

  app.put("/image", upload.array("files"), async (req, res) => {
    const files = req.files;
    while (files.length) {
      try {
        const file = files.shift();
        await sharp(file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toFile(__dirname() + `/images/${file.originalname}`);
        res.status(201).send("Image uploaded successful");
      } catch (error) {
        console.log(error);
        res.status(400).send(error);
      }
    }
  });

  app.get("*.html/:token", html_auth);

  app.get("/search/:api/:word/:limit", search);

  app.post("/login", login);

  app.post("/signup", signup);

  app.put("/update_user", update_user);

  app.get("/status/:user_token/", status);
}
