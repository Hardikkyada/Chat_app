const path = require('path')
const express = require('express')
const {genMsg,genLoc} = require('./utiles/message')
const {getuser,getroom,removeUser,adduser} = require('./utiles/users')
const app = express()

//socket.io
const socketio = require('socket.io')
const http = require('http')
const server = http.createServer(app)
const io  = socketio(server)

const Filter = require('bad-words')

const port = process.env.PORT  || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))
app.use(express.json())
let count =0;



io.on('connection',(socket)=>{

    console.log('New websocket connection');

    //all in the after join room name
    socket.on('join',(options,callback)=>{

        const {error,user} = adduser({id:socket.id , ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)
 
    //send all member new join
    socket.emit('message',genMsg('Admin','Welcome'))

    //send message all menber of room without sender
    socket.broadcast.to(user.room).emit('message',genMsg('Admin',`${user.username} has join`))


    io.to(user.room).emit('roomdata',{
        room:user.room,
        users:getroom(user.room)
    })


    callback()
     
    })

    //send message of specific user of room
    socket.on('sendMsg',(msg,callback)=>
    {
        const user = getuser(socket.id);

        const filter = new Filter();
        if(filter.isProfane(msg)){
            return callback('Profanity not allow')
        }

        io.to(user.room).emit('message',genMsg(user.username,msg));
        callback()

    })

    //disconnect user show all member message
    socket.on('disconnect',()=>{

        const user = removeUser(socket.id);
        
        if(user){
            io.to(user.room).emit('message',genMsg('Admin', `${user.username} has Left!..`))
            io.to(user.room).emit('roomdata',{
                room:user.room,
                users:getroom(user.room)
            })
        }
        //console.log('user left');
         
    })

    //send Location 
    socket.on('sendLoc',(coords,callback)=>{

        const user = getuser(socket.id);

        io.to(user.room).emit('loc_message',genLoc(user.username,`https://www.google.com/maps?q=${coords.lat},${coords.long}`))

        callback()
    })

    /*socket.emit('countUpdated',count)
    socket.on('inc',()=>{
        count++;
        io.emit('countUpdated',count)
    })*/

})


app.get('/', (req, res) => res.send('Hello World!'))

//give server listen
server.listen(port, () => console.log(`Example app listening on port ${port}!`))