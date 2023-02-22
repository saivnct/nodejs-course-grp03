const express = require('express');
const app = express();


//using express.json middleware -> stand between req and response
app.use(express.json());

//custom middleware 1
app.use((req,res,next) => {
    req.abc = 10000;
    console.log('Hello from middleware!!!');
    next();
})


//custom middleware 2



//method 3: mouting the router on a route
const tourRouter = require('./routes/tour');
app.use('/api/v1/tours', tourRouter);




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






app.listen(9000,() => {
    console.log('App running on port 9000...');
});