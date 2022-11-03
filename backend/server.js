const express = require('express');
const app = express();
const chats = require('./data/data')
const dotenv = require('dotenv');
const connectDb = require('./config/db');
const userRoutes = require('./routes/userRoute');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoute');
const notificationRoutes = require('./routes/notificationRoute');
const path = require('path');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDb();


const PORT = process.env.PORT || 5000;


app.use(express.json());

//end point for user
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);

// -------------- Deployment -----------

const _dirname1 = path.resolve();


if (process.env.NODE_ENV === 'production') {

    app.use(express.static(path.join(_dirname1,"/frontend/build")));


    app.get('*',(req,res)=>{
        console.log("inside production");
        res.sendFile(path.resolve(_dirname1,"frontend","build","index.html"));
        
    })
} else {
    app.get("/", (req, res) => {
        res.send("Api running sucessfully");
    })
}


// -------------- Deployment -----------

//error handling middleware
app.use(notFound)
app.use(errorHandler)

const server = app.listen(PORT);

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "https://chitt-chatt-io.herokuapp.com/"
    }
});

io.on("connection", (socket) => {
    console.log("socket io started")

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });


    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("user joined room : " + room);

    });

    socket.on('typing', (room) => {
        socket.in(room).emit("typing");
    });


    socket.on('stop typing', (room) => {
        socket.in(room).emit("stop typing");
    })

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        console.log(chat)

        if (!chat.users) return console.log("chat users not defined");


        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message recieved", newMessageRecieved);

        });
    });

    socket.off("setup", () => {
        socket.leave(userData._id);
    });
})