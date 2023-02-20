const express = require('express');

const app = express();


app.get('/',(req, res) => {
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
});


app.get('/getAllTours',(req, res) => {
    res
        .status(200)
        .send('getAllTours');
});

app.get('/getTourById/:id',(req, res) => {
    console.log(req.params);

    res
        .status(200)
        .send('getTourById');
});




app.listen(9000, () => {
    console.log(`App running on port 9000...`);
});