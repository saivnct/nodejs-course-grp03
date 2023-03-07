const TourDAO = require('./../DAO/TourDAO')
const TourImageDAO = require('./../DAO/TourImageDAO')
const TourStartDateDAO = require('./../DAO/TourStartDateDAO')

exports.checkTourById = async (req, res, next, val) => {
    console.log(`Tour id: ${val}`);

    try{
        const tour = await TourDAO.getTourById(val*1);

        if (!tour){
            return res
                .status(404)    //NOT FOUND
                .json({
                    code: 404,
                    msg: `Not found tour with Id ${val}!`,
                });
        }

        req.tour = tour;
    }catch (e) {
        console.log(e);
        return res
            .status(500)
            .json({
                code: 500,
                msg: e,
            });
    }

    next();
}

exports.getAllTour = async (req,res) => {
    //TODO - implement pagination, sorting, filter !!!!

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

exports.getTourById = async (req,res) => {
    // console.log(req.params);
    try{
        const tour = req.tour;

        res
            .status(200)
            .json({
                code: 200,
                msg: `Get tour by Id successfully!`,
                data: {
                    tour
                }
            })

    }catch (e){
        return res
            .status(500)
            .json({
                code: 500,
                msg: e,
            })
    }
}

exports.deleteById = async (req,res) => {
    const id = req.params.id*1;
    try {
        await TourDAO.deleteTourById(id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Delete tour with ${id} successfully!`,
            })
    } catch (e) {
        console.log(e);
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
    const newTour = req.body;
    try {
        const lastId = await TourDAO.checkLastId();
        newTour.id = lastId + 1;

        await TourDAO.createNewTour(newTour);

        if (newTour.images && newTour.images.length > 0){
            for (let j = 0; j < newTour.images.length; j++) {
                await TourImageDAO.addTourImageIfNotExisted(newTour.id, newTour.images[j]);
            }
        }

        if (newTour.startDates && newTour.startDates.length > 0){
            for (let j = 0; j < newTour.startDates.length; j++) {
                let date = new Date(newTour.startDates[j]);
                await TourStartDateDAO.addTourStartDateIfNotExisted(newTour.id, date.toISOString());
            }
        }


        const tour = await TourDAO.getTourById(newTour.id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Create new tour successfully!`,
                data: {
                    tour
                }
            })
    }catch (e){
        console.log(e);
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
    try {
        const updateInfo = req.body;

        await TourDAO.updateTourById(id , updateInfo);
        const tour = await TourDAO.getTourById(id);
        return res
            .status(200)
            .json({
                code: 200,
                msg: `Update id: ${id} successfully!`,
                data: {
                    tour
                }
            })
    }catch (e){
        console.log(e);
        res
            .status(500)
            .json({
                code: 500,
                msg: e
            });
    }
}
