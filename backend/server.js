const express = require("express");
const app = express();
require("dotenv").config({ path: './config/.env'});
const db = require("./config/db");
const port = process.env.PORT || 5000;
const userRoute = require("./routes/userRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");

// app.use(cors());
app.use(express.json({
    limit: "50mb",
}));
app.use(express.urlencoded({ extended: true }))

app.use("/api/users",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);

const _dirname = path.resolve();
app.use(express.static(path.join(_dirname, "/frontend/build")));
app.get("*",(req,res)=>{
    res.sendFile(path.join(_dirname, "/frontend/build/index.html"))
});

app.use((err, req, res, next)=>{
    res.status(500).send({ message: err.message});
})

const server = app.listen(port,()=>{
    console.log(`Server is running on port : ${port}`);
})

const io = require('socket.io')(server,{
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
   console.log(`Connected to socket.io`);

   //connect frontend to backend socket for each user
   socket.on("setup",(userData)=>{  
      //for each user
      socket.join(userData._id);
      //room for a particular user
      socket.emit("connected");
   })

   //join chat or room
   socket.on("join chat",(room)=> {
     socket.join(room);
     console.log("User Joined Room: "+room);
   })

   //typing live
   socket.on("typing",(room)=>{
     socket.in(room).emit("typing");
   })

   //stop typing live
   socket.on("stop typing",(room)=>{
    socket.in(room).emit("stop typing");
  })

   //send new message
   socket.on("new message", (newMessageReceived)=> {
     var chat = newMessageReceived.chat;
     if(!chat.users){
        return console.log('chat.users not defined');
     }
     chat.users.forEach((user)=> {
        if(user._id == newMessageReceived.sender._id){
            return;
        }
        else{
            socket.in(user._id).emit("message received", newMessageReceived);
        }
     })
   })

   socket.off("setup",()=>{
     console.log("User Disconnected");
     socket.leave(userData._id);
   })
})