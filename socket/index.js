// import { Server } from 'socket.io';
// const io = new Server(9000, {
//     cors: {
//         origin: "http://localhost:9000"
//     }
// });

// io.on('connection', socket => {
//     console.log(`User Connected: ${socket.id}`);
// });

const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

io.on("connection",(socket)=>{
    console.log(`User connected: ${socket.id}`);
    socket.on("send_message",(data)=>{
        console.log(data);
    });
})

server.listen(9000, () => {
    console.log(`Socket server is running at port 9000`);
})
