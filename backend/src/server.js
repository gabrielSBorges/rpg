const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const routes = require('./routes');
const app = express();
const server = require('http').Server(app);

const PORT = process.env.PORT || 3333;

const envvars =  require('./envvars.json');

mongoose.connect(envvars.MONGO_ATLAS, {
  useNewUrlParser : true, 
  useUnifiedTopology: true,
  useFindAndModify: false
});

// const io = require('socket.io')(server);

// const connectedUsers = {};

// io.on('connection', socket => {
//     const { user } = socket.handshake.query;
    
//     connectedUsers[user] = socket.id;
// });


// app.use((req, res, next) => {
//     req.io = io;
//     req.connectedUsers = connectedUsers;

//     return next();
// });

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT);