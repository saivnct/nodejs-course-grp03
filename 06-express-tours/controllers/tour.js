const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`,'utf-8');
const dataArr = JSON.parse(data);
const TourDAO = require('./../DAO/TourDAO')


exports.getAllTour = async (req,res) => {
    // console.log(req.requestTime);
    try{
        const tours = await TourDAO.getAllTours();

        res
            .status(200)
            .json({
                code: 200,
                msg: 'OK',
                data: {
                    tours
                }
            })
    }catch (e) {
        res
            .status(500)
            .json({
                code: 500,
                msg: e,
            })
    }


    // TourDAO.getAllTours()
    //     .then((tours) => {
    //         console.log(tours);
    //
    //         res
    //             .status(200)
    //             .json({
    //                 code: 200,
    //                 msg: 'OK',
    //                 data: {
    //                     tours
    //                 }
    //             })
    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });
}

exports.getTourById = async  (req,res) => {
    // console.log(req.params);
    const id = req.params.id * 1;

    let tour;
    try{
        tour = await TourDAO.getTourById(id)
    }catch (e){
        return res
            .status(500)
            .json({
                code: 500,
                msg: e,
            })
    }


    if (tour) {
        res
            .status(200)
            .json({
                code: 200,
                msg: `Get tour by Id successfully!`,
                data: tour
            })
    }else{
        res
            .status(404)    //NOT FOUND
            .json({
                code: 404,
                msg: `Not found tour with Id ${id}!`,
            })
    }



}
exports.deleteById = async (req,res) => {
    const id = req.params.id*1;
    let tour;
    try {
        tour = await TourDAO.deleteTourById(id)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Delete tour with ${Id} successfully!`,
            })
    } catch (e) {
        return res
            .status(500)
            .json({
                code: 500,
                msg: e
            })
    }
}

exports.createNewTour = async (req,res) => {
    console.log('createNewTour', req.body);
    const newData = req.body;
    let tour;
    try {
        tour = await TourDAO.createNewTour(newData)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new tour successfully!`,
                tour
            })
    }catch (e){
        res
            .status(500)
            .json({
                code: 500,
                msg: e
            });
    }
}

exports.updateTourById = async(req, res) => {
    console.log('Id update', req.params.id);
    const id = req.params.id * 1;
    const updateInfo = req.body;
    if (updateInfo.name){
        const name = updateInfo.name;
    }

    if (typeof updateInfo.price === 'number' && updateInfo.price > 0){
        let price = updateInfo.price;
    }

    if (typeof updateInfo.rating === 'number' && updateInfo.price > 0){
        let rating = updateInfo.price;
    }
    try {
        tour = await TourDAO.updateTourById(id,updateInfo)
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Update id: ${id} successfully!`,
                tour
            })
    }catch (e){
        res
            .status(500)
            .json({
                code: 500,
                msg: e
            });
    }
}
