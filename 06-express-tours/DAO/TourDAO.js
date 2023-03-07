const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');
const TourImageDAO = require('./TourImageDAO');
const TourStartDateDAO = require('./TourStartDateDAO');

async function setTourInfo(tour){
    const tourImages = await TourImageDAO.getByTourId(tour.id);
    const tourStartDates = await TourStartDateDAO.getByTourId(tour.id);
    const images = tourImages.map(i => i.imgName);
    const startDates = tourStartDates.map(i => i.date);
    tour.images = images;
    tour.startDates = startDates;
    return tour
}

exports.checkLastId = async () => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = await dbConfig.db.pool.request()
        .query('SELECT MAX(id) as id FROM Tours');

    console.log(request.recordsets[0]);
    return request.recordsets[0]
}

exports.getAllTours = async () => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request.query('select * from Tours');

    let tours = result.recordsets[0];

    //solution 1 - processing with map & promise
    tours = tours.map(async (t) => {return await setTourInfo(t)})
    tours = await Promise.all(tours);

    //solution 2 - basic for loop
    // for (let i = 0; i < tours.length; i++){
    //     await setTourInfo(tours[i]);
    // }

    return tours;
}

exports.getTourById = async (id) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request
        .input('id', sql.Int, id)
        .query('select * from Tours where id = @id');

    const tour = await setTourInfo(result.recordsets[0][0]);
    return tour;
}

exports.getTourByName = async (name) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request
        .input('name', sql.VarChar, name)
        .query('select * from Tours where name = @name');

    // console.log(result);

    return result.recordsets[0][0];
}


exports.deleteTourById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('id', sql.Int, id)
        .query('delete TourImage where id = @id')
        .query('delete TourStartDate where id = @id')
        .query('delete Tours where id = @id');

    // console.log(result);
    return result.recordsets;
}

exports.createNewTour = async(tour) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    if (!tour){
        throw new Error('Invalid input param');
    }
    let id = this.checkLastId + 1;
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('id', sql.Int, id)
        .input('name', sql.VarChar, tour.name)
        .input('duration', sql.Int, tour.duration)
        .input('maxGroupSize', sql.Int, tour.maxGroupSize)
        .input('difficulty', sql.VarChar, tour.difficulty)
        .input('ratingsAverage', sql.Float, tour.ratingsAverage)
        .input('ratingsQuantity', sql.Int, tour.ratingsQuantity)
        .input('price', sql.Int, tour.price)
        .input('summary', sql.VarChar, tour.summary)
        .input('description', sql.VarChar, tour.description)
        .input('imageCover', sql.VarChar, tour.imageCover)
        .input('images', sql.VarChar, tour.images)
        .input('startDates', sql.VarChar, tour.startDates)
        .query('insert into Tours (id, name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover) values (@id, @name, @duration, @maxGroupSize, @difficulty, @ratingsAverage, @ratingsQuantity, @price, @summary, @description, @imageCover)')
        .query('insert into TourImage (tourId, images) values (@tourId, @images)')
        .query('insert into TourStartDate (tourId, startDates) values (@tourId, @startDates)');
    console.log(result);
    return result.recordsets;
}

exports.updateTourById = async (id, updateInfo) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    if (!updateInfo){
        throw new Error('Invalid input param');
    }

    let request = dbConfig.db.pool.request();
    request.input('id', sql.Int, id);

    let query = 'update Tours set';

    if (updateInfo.name){
        request.input('name', sql.VarChar, updateInfo.name);
        query += ' name = @name,';
    }

    if (typeof updateInfo.price === 'number' && updateInfo.price >= 0){
        request.input('price', sql.Int, updateInfo.price);
        query += ' price = @price,';
    }

    if (typeof updateInfo.rating === 'number' && updateInfo.rating >= 0 && updateInfo.rating <= 5){
        request.input('rating', sql.Float, updateInfo.rating);
        query += ' rating = @rating,';
    }

    query = query.slice(0, -1); //receive query without last character ','

    query += ' where id = @id'

    console.log(query);


    let result = await request.query(query);

    // console.log(result);
    return result.recordsets;
}

exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query(`delete Tours`);

    // console.log(result);
    return result.recordsets;
}

exports.addTourIfNotExisted = async (tour) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    if (!tour) {
        throw new Error('Invalid input param');
    }
    let request = dbConfig.db.pool.request()
    let result = await request
        .input('id', sql.Int, tour.id)
        .input('name', sql.VarChar, tour.name)
        .input('duration', sql.Int, tour.duration)
        .input('maxGroupSize', sql.Int, tour.maxGroupSize)
        .input('difficulty', sql.VarChar, tour.difficulty)
        .input('ratingsAverage', sql.Float, tour.ratingsAverage)
        .input('ratingsQuantity', sql.Int, tour.ratingsQuantity)
        .input('price', sql.Int, tour.price)
        .input('summary', sql.VarChar, tour.summary)
        .input('description', sql.VarChar, tour.description)
        .input('imageCover', sql.VarChar, tour.imageCover)
        .query('insert into Tours ' +
            '(id, name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover) ' +
            'SELECT @id, @name, @duration, @maxGroupSize, @difficulty, @ratingsAverage, @ratingsQuantity, @price, @summary, @description, @imageCover ' +
            'WHERE NOT EXISTS(SELECT * FROM Tours WHERE id = @id)');
    // console.log(result);
    return result.recordsets;
}