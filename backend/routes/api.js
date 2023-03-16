const route = require('express').Router();

const apiController = require('./../controllers/apiController');
const authController = require('./../controllers/authController');

route.post('/signup', authController.signup);
route.post('/login', authController.login);

route
    .route('/')
    .get(apiController.getUser)
    .post(apiController.checkUser,apiController.saveUser);

route
    .route('/:id')
    .get(apiController.getByid)
    .patch(apiController.updateUser)
    .delete(authController.protect,authController.restrictTo('admin'), apiController.deleteUser);
    

module.exports = route;