const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8');
const dataArr = JSON.parse(data);


exports.getAllTour = (req,res) => {
    res
        .status(200)
        .json({
            code: 200,
            msg: 'OK',
            data: {
                tours: dataArr
            }
        })
}

exports.getTourById = (req,res) => {
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
}

exports.deleteById = (req,res) => {
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
}

exports.createNewTour = (req,res) => {
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
}

exports.updateTourById = (req, res) => {
    console.log('Id update', req.params.id);
    const id = req.params.id * 1;
    const updateInfo = req.body;
    const index = dataArr.findIndex((tour) => {return tour.id === id});

    if (index < 0){
        return res.status(404)
            .json({
                code: 404,
                msg: `Not found tour with ${id}!`
            })
    }


    const tourUpdate = dataArr[index];

    // console.log('Data update by Id',tourUpdate);
    if (updateInfo.name){
        tourUpdate.name = updateInfo.name;
    }


    if (typeof updateInfo.duration === 'number' && updateInfo.duration > 0){
        tourUpdate.duration = updateInfo.duration;
    }

    if (typeof updateInfo.maxGroupSize === 'number'  && updateInfo.maxGroupSize > 0){
        tourUpdate.maxGroupSize = updateInfo.maxGroupSize;
    }




    fs.writeFile('./dev-data/data/tours-simple.json', JSON.stringify(dataArr) , (err) => {
        res
            .status(200)
            .json({
                code: 200,
                msg: `Update id: ${id} successfully!`
            });
    })
}
