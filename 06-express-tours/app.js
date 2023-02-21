const express = require('express');
const fs = require('fs');
const app = express();
const data = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,'utf-8')
const dataArr = JSON.parse(data);

//using express.json middleware -> stand between req and response
app.use(express.json());

app.get('/',(req, res) => {
    // res
    //     .status(200)
    //     .send('Hello form server :<');

    let person = {
        name: 'va',
        age: 23
    }
    res.status(200).json(person);
})

app.get('/getAllTour',(req,res) => {
    res
        .status(200)
        .send(dataArr)
});
app.get('/getTourById/:id',(req,res) => {
   // console.log(req.params);
    const id = req.params.id * 1;
    const dataGet = dataArr[id];
    console.log('Data get by Id',dataGet);
    res
        .status(200)
        .send(dataGet)
});
app.get('/deleteById/:id',(req,res) => {
    console.log('Id delete', req.params.id);
    const id = req.params.id*1;

    const index = dataArr.findIndex((tour) => {return tour.id === id});
    if (index >= 0){
        const dataDel = dataArr[index];
        dataArr.splice(index,1);
        fs.writeFileSync('./dev-data/data/tours-simple.json', JSON.stringify(dataArr));
        console.log('Data delete by Id',dataDel);
    }

    res
        .status(200)
        .send(`Delete id: ${id} successfully!`)

})
app.post('/createNewTour',(req,res) => {
    console.log('createNewTour', req.body);
    const newData = req.body;
    dataArr.push(newData)
    fs.writeFileSync('./dev-data/data/tours-simple.json', JSON.stringify(dataArr))
    res
        .status(200)
        .send(`Add new tour successfully!`)

})


app.listen(9000,() => {
    console.log('App running on port 9000...');
});