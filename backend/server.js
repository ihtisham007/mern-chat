const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');

const app = require('./index');
let server = http.createServer(app);
const io = new Server(server);

const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});


io.on('connection', (socket) => {
    console.log('a user connected');
});
  


const User = require('./models/userModel');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION', err.message);
    process.exit(1);  
})


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

//mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true})


// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true,
// }).then(() => console.log('DB Connected'))
//     .catch(err => console.log(err));



const port  = process.env.PORT || 5000;
server = app.listen(port, ()=>{
    console.log(`Server is running`);
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED PROMISE REJECTION', err.message);
    server.close(() => {
        process.exit(1);   
    });

})





