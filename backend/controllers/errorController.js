const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {

   return new AppError(`Invalid id`, 400);
}

const handleDuplicateFieldsDB = (err) => {
    return new AppError(`Duplicate field value entered ${err['keyValue']['email']}`, 400);
}

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.path + ': ' + el.value + ' ' + el.kind + ',');
    return new AppError(`Invalid input data please check ${errors}`, 400);
}

const  handleJWTtokenError = () => {
    return new AppError(`Invalid token`, 401);
}

const handleJWTExpireError = () => {
    return new AppError(`Token has expired`, 401);
}

const sendErrorDev = (err, res) => {

    console.log(err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,

    })
}


const sendErrorProd = (err, res) => {
    //Operational, trusted error: send message to client
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    // Programming or other unknown error: don't leak error details
    }else{
        //1) Log error
        console.error(`ERROR 💥: ${err}`);
        //2) Send generic message
        res.status(500).json({
            status: 'Error',
            message: 'Something went very wrong',
        })
    }

}


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(process.env.NODE_ENV === 'development'){
       sendErrorDev(err, res);

    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};
        if(error.statusCode === 404) error =  handleCastErrorDB(error);
        if(error.code === 11000)  error =  handleDuplicateFieldsDB(error);
        if(error._message === 'User validation failed') error =  handleValidationErrorDB(error);
        if(error.name === 'JsonWebTokenError') error =  handleJWTtokenError();
        if(error.name === 'TokenExpiredError') error =  handleJWTExpireError();
        sendErrorProd(error, res);
   
    }

}