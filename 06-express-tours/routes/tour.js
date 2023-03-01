const express = require('express');
const tourController = require('./../controllers/tour');
const router = express.Router(); //middleware


router.param('id', tourController.checkTourById);


router
    .route('/')
    .get(tourController.getAllTour)
    .post(tourController.createNewTour);


router
    .route('/:id')
    .get(tourController.getTourById)
    .delete(tourController.deleteById)
    .patch(tourController.updateTourById);



module.exports = router;


