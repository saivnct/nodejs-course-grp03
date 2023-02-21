const express = require('express');
const fs = require('fs');
const app = express();
const data = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,'utf-8')
const dataArr = JSON.parse(data);

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
//    console.log(req.params.id);
    const id = req.params.id;
    const dataGet = dataArr[id];
    console.log('Data get by Id',dataGet);
    res
        .status(200)
        .send(dataGet)
});
app.get('/deleteById/:id',(req,res) => {
    console.log('Id delete', req.params.id);
    const id = req.params.id;
    const dataDel = dataArr[id];
    delete dataArr[id];
    fs.writeFileSync('./dev-data/data/tours-simple.json', JSON.stringify(dataArr))
    console.log('Data delete by Id',dataDel);
    console.log('Data get by Id',dataArr);
    res
        .status(200)
        .send(`Delete id: ${id} successfully!`)

})
app.listen(9000,() => {
    console.log('App running on port 9000...');
});