const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');

exports.addTourImageIfNotExisted = async (imgInfo) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    if (!imgInfo) {
        throw new Error('Invalid imgInfo input param');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('tourId', sql.Int, imgInfo.tourId)
        .input('imgName', sql.VarChar, imgInfo.imgName)
        .query('insert into TourImage (tourId, imgName) SELECT @tourId, @imgName WHERE NOT EXISTS(SELECT * FROM TourImage WHERE tourId = @tourId AND imgName = @imgName)');

    console.log(result);
    return result.recordsets;
}

exports.getByTourId = async (tourId) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }
    if (!tourId) {
        throw new Error('Invalid TourImage input param');
    }
    let request =  dbConfig.db.pool.request()
    let result = await request
        .input('tourId',sql.Int, tourId)
        .query('select * from TourImage where tourId = @tourId')
    return result.recordset;
}

exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query('delete TourImage');

    return result.recordsets;
}