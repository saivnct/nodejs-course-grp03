const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');

exports.addTourImageIfNotExisted = async (tourId, imgName) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('tourId', sql.Int, tourId)
        .input('imgName', sql.VarChar, imgName)
        .query('insert into TourImage (tourId, imgName) ' +
            'SELECT @tourId, @imgName ' +
            'WHERE NOT EXISTS(SELECT * FROM TourImage WHERE tourId = @tourId AND imgName = @imgName)');

    // console.log(result);
    return result.recordsets;
}

exports.getByTourId = async (tourId) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }
    if (typeof tourId !== 'number') {
        throw new Error('Invalid TourImage input param');
    }
    let request =  dbConfig.db.pool.request()
    let result = await request
        .input('tourId',sql.Int, tourId)
        .query('select * from TourImage where tourId = @tourId')
    return result.recordsets[0];
}

exports.deleteTourImageById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('id', sql.Int, id)
        .query('delete TourImage where tourId = @id')

    // console.log(result);
    return result.recordsets;
}

exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query('delete TourImage');

    return result.recordsets;
}