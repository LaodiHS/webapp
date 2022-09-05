const { GenerateDomResources } = require("./lib/nodeModuleFileResource.js");
let script_and_style_dependencies = new GenerateDomResources();
var express = require("express");
const listenersEmitters= require("./Listeners_Emitters");
var app = express();
const port = process.env.PORT || 8080;
const host = process.env.PORT ? `https://live-interactive-code-editor.herokuapp.com`:`http://localhost:${port}`;
const path = require("path");

const { write_file } = require("./lib/write_to_file.js");
const fs = require("fs");

(async () => {
  let i = 0;
  // const tab = await require("../lib/puppeteer_module.js").start();
  const editor_instances = {};

  const error_messages = {};

  const log_to_client = {
    logging: {
      string: (type_, socket) => {
        const correct_type = typeof type === "string";
        socket.emit(logging, { data: { editor_saved: correct_type } });
        return correct_type;
      },
    },
  };

  
  const { scripts, styles } = await script_and_style_dependencies.getAllScripts(
    [
      "codemirror.theme.files",
      "codemirror.lib.files",
      "codemirror.mode.javascript.files",
      "codemirror.mode.clike.files",
      "codemirror.addon.selection.files",
      "codemirror.addon.edit.files",
      "codemirror.addon.search.files",
      "codemirror.addon.lint.files",
      "codemirror.addon.hint.files",
      "codemirror.addon.dialog.files",
      "jshint.dist.files",
    ]
  );

  app
    .use("/static", express.static("./node_modules"))
    .use("/public", express.static("./public"))
    .set("views", path.join(__dirname, "views"))
    .get("/", (req, res) =>
      res.send(`<!DOCTYPE html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>Socket.io Code Editor</title>
            <link rel="icon" type="image/x-icon" href="/public/favicon.ico">
            ${styles}
            <link rel="stylesheet" href="public/styles.css">
        </head>
        <body>
      <span class="header_span"><a href="https://wujimu.herokuapp.com/"> back</a> </div><h1> JS Code Editor </h1>
      </span>
         <div id="textArea"></div>
            <div id="news-list"></div>
            <script src="static/socket.io-client/dist/socket.io.js"></script>
           ${scripts}
            <script>
            let editor;
            document.addEventListener("DOMContentLoaded", function () {
              const socket = io("${host}");
              socket.on(
                  "socket_connect", (editor_) => {
                eval(editor_.editor.editor_options.dom[0])
                  })
            });
            </script>
            <script id="numberOneTwoThree">
            document.addEventListener("DOMContentLoaded", function () {
              Array.from(document.querySelectorAll("[src^=static]")).forEach(element => element.remove())
             document.getElementById("numberOneTwoThree").remove();
             Array.from(document.querySelectorAll("script")).map(node=> node.remove())
            });
            </script>
        </body>
    </html>`)
    );

  var http = require("http").Server(app);

  var io = require("socket.io")(http);

  io.on("disconnect", (socket) => {
    socket.close();
  });

  io.on("connection", (socket) => {
    let uniqueId =
      socket.handshake.headers["user-agent"] + socket.handshake.address;
    if (!editor_instances[uniqueId]) {
      const {editor_model
    } = require("./editor_model.js")
      editor_instances[uniqueId] = new editor_model("", uniqueId);
    }
    const editor = editor_instances[uniqueId];

    socket.emit("socket_connect", { editor: editor.start_editor() });

    listenersEmitters.server.listeners.forEach((node) => {
      socket.on(node.socket_flag, ({ data }) => {
        console.log("data", data);
      });
    });

    // socket.on(`url`, (url) => {
    //   (async (url) => {
    //     console.log("url-->", url);

    //   //   await tab
    //   //     .goto(url.data, {
    //   //       waitUntil: "networkidle0",
    //   //     })
    //   //     .then((data) => {
    //   //       return data;
    //   //     })

    //   //     .catch(console.error);
    //   //   const data = await tab.evaluate(() => {});
    //    })(url);

    // });

    socket.on("editorText", (data) => {
      console.log("data:", data);
    });
  });

  http.listen(port, () => {
    // will start once server starts
    console.error(`Listening on ${8080}`);
  });
})();


