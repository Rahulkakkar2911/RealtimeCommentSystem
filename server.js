const app = require('./app');
const port = process.env.PORT || 8000;
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const url = "mongodb://localhost/comments" || process.env.DBSTRING;

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology: true
}).then(()=>{
    console.log(`😊 DB Connection successfull`);
}).catch(err => {
    console.log(`💣 DB Connection ERR -> ${err}`);
});

const server = app.listen(port, (err)=>{
    if(err) console.log(err);
    else console.log(`Server is Up and running on PORT : ${port}`);
});

const io = require('socket.io')(server);
//once any browser, connects this socket, then the below event will be fired 
io.on('connection', (socket)=>{
    //socket.id is the unique id given by the connection
    //recieve event;
    socket.on('comment', (data) => {

        data.time = Date();
        //broadcasting to other clients
        socket.broadcast.emit('comment', data)
    });
    socket.on('typing', (data)=>{
        socket.broadcast.emit('typing', data);
    });
});
