const dbConfig = require('./../database/dbconfig');
const TourStartDateSchema = require('.././model/TourStartDate');

exports.addTourStartDateIfNotExisted = async (tourId, date) => {
    if (!dbConfig.db.pool) {
        throw new Error('Not connected to db');
    }

    let request =  dbConfig.db.pool.request()
    let result = await request
        .input(`${TourStartDateSchema.schema.tourId.name}`, TourStartDateSchema.schema.tourId.sqlType, tourId)
        .input(`${TourStartDateSchema.schema.date.name}`, TourStartDateSchema.schema.date.sqlType, date)
        .query(`insert into ${TourStartDateSchema.schemaName} (${TourStartDateSchema.schema.tourId.name}, ${TourStartDateSchema.schema.date.name}) ` +
            `SELECT @${TourStartDateSchema.schema.tourId.name}, @${TourStartDateSchema.schema.date.name} ` +
            `WHERE NOT EXISTS(SELECT * FROM ${TourStartDateSchema.schemaName} WHERE ${TourStartDateSchema.schema.tourId.name} = @${TourStartDateSchema.schema.tourId.name} AND ${TourStartDateSchema.schema.date.name} = @${TourStartDateSchema.schema.date.name})`)
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
        .input(`${TourStartDateSchema.schema.tourId.name}`, TourStartDateSchema.schema.tourId.sqlType, tourId)
        .query(`select * from ${TourStartDateSchema.schemaName} where ${TourStartDateSchema.schema.tourId.name} = @${TourStartDateSchema.schema.tourId.name}`)
    return result.recordsets[0];
}
exports.deleteTourStartDateById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(`${TourStartDateSchema.schema.tourId.name}`, TourStartDateSchema.schema.tourId.sqlType, id)
        .query(`delete ${TourStartDateSchema.schemaName} where ${TourStartDateSchema.schema.tourId.name} = @${TourStartDateSchema.schema.tourId.name}`)

    // console.log(result);
    return result.recordsets;
}
exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query(`delete ${TourStartDateSchema.schemaName}`);
    return result.recordsets;
}