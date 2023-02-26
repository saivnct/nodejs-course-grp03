const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');
const app = express();

dotenv.config({
    path: './config.env'
})

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

//method 2: combine same routes but different handlers
// app.route('/api/v1/tours')
//     .get(getAllTourHandler)
//     .post(createNewTourHandler);
//
// app.route('/api/v1/tours/:id')
//     .get(getTourByIdHandler)
//     .delete(deleteByIdHandler)
//     .patch(updateTourByIdHandler);



//method 1: seperate routees
// app.get('/api/v1/tours', getAllTourHandler);
// app.post('/api/v1/tours', createNewTourHandler);
// app.get('/api/v1/tours/:id', getTourByIdHandler);
// app.delete('/api/v1/tours/:id', deleteByIdHandler);
// app.patch('/api/v1/tours/:id',updateTourByIdHandler);

//START SERVER
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App running on port ${PORT}...`);
});