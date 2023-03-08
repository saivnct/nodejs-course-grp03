const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');

exports.addTourStartDateIfNotExisted = async (tourId, date) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }

    let request =  dbConfig.db.pool.request()
    let result = await request
        .input('tourId',sql.Int, tourId)
        .input('date', sql.Date, date)
        .query('insert into TourStartDate (tourId, date) ' +
            'SELECT @tourId, @date ' +
            'WHERE NOT EXISTS(SELECT * FROM TourStartDate WHERE tourId = @tourId AND date = @date)')
    return result;
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
        .query('select * from TourStartDate where tourId = @tourId')
    return result.recordsets[0];
}
exports.deleteTourStartDateById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('id', sql.Int, id)
        .query('delete TourStartDate where tourId = @id')

    // console.log(result);
    return result.recordsets;
}
exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query('delete TourStartDate');
    return result.recordsets;
}