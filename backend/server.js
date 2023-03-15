const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env'});

const app = require('./index');
const User = require('./models/userModel');

process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION', err.message);
    process.exit(1);  
})


const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose.connect(process.env.DATABASE_LOCAL, {useNewUrlParser: true, useUnifiedTopology: true})


// mongoose.connect(process.env.DATABASE_LOCAL, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: true,
// }).then(() => console.log('DB Connected'))
//     .catch(err => console.log(err));



const port  = process.env.PORT || 3000;
const server = app.listen(port, ()=>{
    console.log(`Server is running`);
})

process.on('unhandledRejection', err => {
    console.log('UNHANDLED PROMISE REJECTION', err.message);
    server.close(() => {
        process.exit(1);   
    });

})





