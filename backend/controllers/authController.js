const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');  
const AppError = require('./../utils/appError');


const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup =  catchAsync(async (req,res) =>{
    // const newuser = await User.create(req.body);  //insure user can be assign as admin 

    //new way more secure way to create user
    const newuser = await User.create({
        fullName: req.body.fullName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role,
        phone: req.body.phone,
    }); //insure user can be assign as admin 
 
    const token = signToken(newuser._id);


    res.status(201).json({
        message: 'User created successfully',
        token,
        user: newuser
    });

})

exports.login = catchAsync( async(req,res, next) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({email}).select('+password');
    
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password', 401));
    }
  
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token        
    });
});

exports.protect = catchAsync(async (req, res, next) =>{
    // 1) getting token and check if it is there in the header or not if not then it will return null   
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token) return next(new AppError('You are not logged in! Please log in to get access', 401));
    
    //2) if token is valid then we will get the user id from the token

   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

    //3) find user by id and check if user exists
    const freshUser = await User.findById(decoded.id)
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again', 401));
    }

    //Grand access to protected route
    
    //4) check if user changed password after the token was issued

    freshUser.changedPasswordAfter(decoded.iat)

    next();
})


// Grant access to specific roles only Authorization: 'Bearer eyJhbGciOiJ...'
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        console.log(req);
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}
