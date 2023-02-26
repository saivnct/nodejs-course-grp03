const express = require('express');
const userController = require('./../controllers/user');
const userRouter = express.Router();

userRouter
    .route('/')
    .get(userController.getAllUser)
    .post(userController.createNewUser)

userRouter
    .route('/:id')
    .get(userController.getUserById)
    .delete(userController.deleteUserById)
    .patch(userController.updateUserById)


module.exports = userRouter;