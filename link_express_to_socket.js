import { createServer } from 'http'

import { Server } from 'socket.io'

import express from 'express'




export default async function link_express_to_socket(express_app, port) {

    express_app.use(express.static("./node_modules/socket.io/client-dist"))
    // express_app.use(express.static(join(__dirname, './public')));
    const http = createServer(express_app);

    const io = new Server(http, {
        handlePreflightRequest: (req, res) => {
            const headers = {
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
                "Access-Control-Allow-Origin": req.headers.origin,
                "Access-Control-Allow-Credentials": true
            };
            res.writeHead(200, headers);
            res.end();
        }
    });

 

    const id_to_socket = new Map();

    const connectedUsers = new Set(); 
    
    let connected_users = [...connectedUsers]
    io.on('connection', socket => {

        let email = socket.handshake.query.email
        id_to_socket.set(email, socket.id);
        connectedUsers.add(email)
        connected_users = [...connectedUsers]
        socket.broadcast.emit('update-user-list', { userIds: connected_users });

        socket.on('disconnect', () => {
            connectedUsers.delete(socket.handshake.query.email)
                             connected_users = [...connectedUsers]
            socket.broadcast.emit('update-user-list', { userIds:  connected_users})
        })

        socket.on('mediaOffer', data => {
            socket.to(id_to_socket.get(data.to)).emit('mediaOffer', {
                from: data.from,
                offer: data.offer
            });
        });

        socket.on('mediaAnswer', data => {
            socket.to(id_to_socket.get(data.to)).emit('mediaAnswer', {
                from: data.from,
                answer: data.answer
            });
        });

        socket.on('iceCandidate', data => {

            socket.to(id_to_socket.get(data.to)).emit('remotePeerIceCandidate', {
                candidate: data.candidate
            })
        })

        socket.on('requestUserList', () => {
          
                socket.emit('update-user-list', { userIds: connected_users });
            socket.broadcast.emit('update-user-list', { userIds: connected_users });
           
        });
    });

    http.listen(port, () => {
        console.log(`listening on *:${port}`);
    });

}