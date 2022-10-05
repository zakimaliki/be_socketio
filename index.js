const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const PORT = 4000;
const HOST = "http://localhost:"
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors:{
        origin:'http://localhost:3000'
    }
});



io.on("connection", (socket) => {
    console.log(`ada perangkat yang terhubung dengan id ${socket.id}`);
    socket.on('messageAll',({message,user})=>{
        const current = new Date();
        let time = current.toLocaleTimeString();
        io.emit('messageBE', {user,message,date:time})
    })
    socket.on('messagePrivate',({message,id,user})=>{
        const current = new Date();
        let time = current.toLocaleTimeString();
        // socket.emit('messageBE', {user,message,date:time})
        socket.to(id).emit('messageBE', {user,message,date:time})
    })
    socket.on('inisialRoom',({room,username})=>{
        console.log(room);
        socket.join(room)
        // const current = new Date();
        // let time = current.toLocaleTimeString();
        // socket.broadcast.to(room).emit('notifAdmin', {
        //     sender:"Admin",
        //     message:`${username} selamat bergabung`,
        //     date:time
        // })
    })
    socket.on('sendMessage',({sender,message,room})=>{
        console.log(sender,message,room);
        const current = new Date();
        let time = current.toLocaleTimeString();
        io.to(room).emit('newMessage', {sender,message,date:time})
    })
    socket.on('disconnect',()=>{
        console.log(`ada perangkat yang terputus dengan id ${socket.id}`);
    })
});


httpServer.listen(PORT,()=>{
    console.log(`${HOST}${PORT}`);
})

