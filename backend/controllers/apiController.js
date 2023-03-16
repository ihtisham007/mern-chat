const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const getUser =  catchAsync(async (req, res, next) => {   

    // const features = new APIFeatures(User.find(), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();
    // const users = await features.query;
    // res.status(200).json({
    //     status: 'success',
    //     data: users
    // });
     res.status(200).json({
        status: 'Server is running',
    });
})

const getByid = catchAsync(async (req,res, next) =>{

    const user = await User.findById(req.params.id);
    
    if(!user) return next(new AppError('No user found with this id', 404));

    res.status(200).json({
        status: 'success',
        data: user
    });

})


const saveUser = catchAsync(async (req, res,next) => {
    const user = req.body;
    const newUser = await User.create(user);
    res.status(201).json({
        status: 'success',
        data: newUser
    });
})


const updateUser = catchAsync(async (req, res,next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if(!user) return next(new AppError('No user found with this id', 404));
    res.status(200).json({
        status: 'success',
        data: user
    });
})

//delete user
const deleteUser = catchAsync(async (req, res,next) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user) return next(new AppError('No user found with this id', 404));
    res.status(200).json({
        status: 'success',
        data: user
    });
})

const userTrackerTime = catchAsync(async (req,res)=>{
    const {search,from,to} = req.body;
    const page = req.params.page;
    
});


const checkUser = (req, res, next) => {
    const user = req.body;
    if (!user.email || !user.password || !user.fullName) {
        return res.status(400).json({
            message: 'fullname,Email and password are required',
        });
    }
    next();
}

const checkGetID = (req,res,next) =>{
    const get_id = req.params.id *1;
    next();
}

module.exports = {
    getUser,
    getByid,
    saveUser,
    checkUser,
    checkUser,
    checkGetID,
    updateUser,
    deleteUser,
    userTrackerTime

}
