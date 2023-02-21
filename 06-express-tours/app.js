const express = require('express');
const fs = require('fs');
const app = express();
const data = fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`,'utf-8')
const dataArr = JSON.parse(data);

//using express.json middleware -> stand between req and response
app.use(express.json());

app.get('/',(req, res) => {
    res
        .status(200)
        .json({
            code: 200,
            msg: 'OK'
        })
})

app.get('/getAllTour',(req,res) => {
    res
        .status(200)
        .json({
            code: 200,
            msg: 'OK',
            data: {
                tours: dataArr
            }
        })
});


app.get('/getTourById/:id',(req,res) => {
   // console.log(req.params);
    const id = req.params.id * 1;
    const dataGet = dataArr[id];
    console.log('Data get by Id',dataGet);
    res
        .status(200)
        .json({
            code: 200,
            msg: `Get tour by Id successfully!`,
            data: dataGet
        })
});


app.get('/deleteById/:id',(req,res) => {
    console.log('Id delete', req.params.id);
    const id = req.params.id*1;

    const index = dataArr.findIndex((tour) => {return tour.id === id});
    if (index >= 0){
        const dataDel = dataArr[index];
        dataArr.splice(index,1);
        console.log('Data delete by Id',dataDel);

        fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(dataArr) , (err) => {
            res
                .status(200)
                .json({
                    code: 200,
                    msg: `Delete id: ${id} successfully!`
                });
        })
    }else{
        res
            .status(404)
            .json({
                code: 404,
                msg: `Not found tour with ${id}!`
            })
    }
})

app.post('/createNewTour',(req,res) => {
    console.log('createNewTour', req.body);
    const newData = req.body;
    dataArr.push(newData)

    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(dataArr), (err) => {
        if(!err) {
            res
                .status(201)
                .json({
                    code: 201,
                    msg: `Add new tour successfully!`,
                    data: newData
                });
        } else {
            res
                .status(500)
                .json({
                    code: 500,
                    msg: `Add new tour fail!`
                });
        }

    });
})


app.listen(9000,() => {
    console.log('App running on port 9000...');
});