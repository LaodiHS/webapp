const {search} = require("./convert-csv-to-json.js")

async function express_socket_io(app, callback){
  const port = process.env.PORT || 8080;
var http = require("http").Server(app);

var io = require("socket.io")(http);

io.on("disconnect", (socket) => {
  socket.close();
});

io.on("connection", (socket) => {
  let uniqueId =
    socket.handshake.headers["user-agent"] + socket.handshake.address;
  socket.emit("socket_connect", { connection:"connected" });
  socket.on("search", (data) => {
    console.log("data:", data);
    
    //search()
  });
});

http.listen(port, () => {
  // will start once server starts
  console.log(`Listening on ${8080}`);
});

}

module.exports= {express_socket_io: express_socket_io}