const express = require('express');

const app = express();


const indexHandler = (req, res) => {
    // res
    //     .status(200)
    //     .send('Hello from server !!!');

    let person = {
        name: 'abc',
        age: 18
    }

    res
        .status(200)
        .json(person);
}

const getAllToursHanlder = (req, res) => {
    res
        .status(200)
        .send('getAllTours');
}

const getTourById = (req, res) => {
    console.log(req.params);

    res
        .status(200)
        .send('getTourById');
}





app.get('/',indexHandler);

app.get('/getAllTours',getAllToursHanlder);

app.get('/getTourById/:id',getTourById);




app.listen(9000, () => {
    console.log(`App running on port 9000...`);
});