// import WebSocket, { WebSocketServer } from 'ws'
import express from 'express';
import { dirname, join } from 'path';
import Promise from "bluebird"
import fs from 'fs';
import { fileURLToPath } from "url";
const fileSystem = Promise.promisifyAll(fs);
const __dirname = dirname(fileURLToPath(import.meta.url))


const app = express();

import { createServer } from 'http'
const http = createServer(app);
import { Server } from 'socket.io'
const io = new Server(http, {
  handlePreflightRequest: (req, res) => {
      const headers = {
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
          "Access-Control-Allow-Credentials": true
      };
      res.writeHead(200, headers);
      res.end();
  }
});


export default function signal_server() {
  app.use(express.static(join(__dirname, "../../node_modules/socket.io/client-dist")))
  app.use(express.static(join(__dirname, './public')));

  let connectedUsers = [];

  io.on('connection', socket => {
    connectedUsers.push(socket.id);

    socket.on('disconnect', () => {
      connectedUsers = connectedUsers.filter(user => user !== socket.id)
      socket.broadcast.emit('update-user-list', { userIds: connectedUsers })
    })

    socket.on('mediaOffer', data => {
      socket.to(data.to).emit('mediaOffer', {
        from: data.from,
        offer: data.offer
      });
    });

    socket.on('mediaAnswer', data => {
      socket.to(data.to).emit('mediaAnswer', {
        from: data.from,
        answer: data.answer
      });
    });

    socket.on('iceCandidate', data => {
      socket.to(data.to).emit('remotePeerIceCandidate', {
        candidate: data.candidate
      })
    })

    socket.on('requestUserList', () => {
      socket.emit('update-user-list', { userIds: connectedUsers });
      socket.broadcast.emit('update-user-list', { userIds: connectedUsers });
    });
  });

  http.listen(3000, () => {
    console.log('listening on *:3000');
  });
}


signal_server()