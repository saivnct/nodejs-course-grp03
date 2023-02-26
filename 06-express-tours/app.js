const express = require('express');
const morgan = require('morgan');
const app = express();


//The order of middleware in stack is defined by the order they are defined in the code

if (process.env.NODE_ENV === 'dev'){
    //3RD-party MIDDLE WARE - HTTP request logger middleware
    app.use(morgan('dev'));
}


//using express.json middleware -> stand between req and response
app.use(express.json());

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log("request Time:", req.requestTime);
    next();
});



//method 3: mouting the router on a route
const tourRouter = require('./routes/tour');
const userRouter = require('./routes/user');

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

