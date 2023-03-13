const dbConfig = require('./../database/dbconfig');
const TourImageSchema = require('.././model/TourImage');

exports.addTourImageIfNotExisted = async (tourId, imgName) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(`${TourImageSchema.schema.tourId.name}`, TourImageSchema.schema.tourId.sqlType, tourId)
        .input(`${TourImageSchema.schema.imgName.name}`, TourImageSchema.schema.imgName.sqlType, imgName)
        .query(`insert into ${TourImageSchema.schemaName} (${TourImageSchema.schema.tourId.name}, ${TourImageSchema.schema.imgName.name}) ` +
            `SELECT @${TourImageSchema.schema.tourId.name}, @${TourImageSchema.schema.imgName.name} ` +
            `WHERE NOT EXISTS(SELECT * FROM ${TourImageSchema.schemaName} WHERE ${TourImageSchema.schema.tourId.name} = @${TourImageSchema.schema.tourId.name} AND ${TourImageSchema.schema.imgName.name} = @${TourImageSchema.schema.imgName.name})`);

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
        .input(`${TourImageSchema.schema.tourId.name}`, TourImageSchema.schema.tourId.sqlType, tourId)
        .query(`select * from ${TourImageSchema.schemaName} where ${TourImageSchema.schema.tourId.name} = @${TourImageSchema.schema.tourId.name}`)
    return result.recordsets[0];
}

exports.deleteTourImageById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(`${TourImageSchema.schema.tourId.name}`, TourImageSchema.schema.tourId.sqlType, id)
        .query(`delete ${TourImageSchema.schemaName} where ${TourImageSchema.schema.tourId.name} = @${TourImageSchema.schema.tourId.name}`)

    // console.log(result);
    return result.recordsets;
}

exports.clearAll = async () => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let result = await dbConfig.db.pool.request().query(`delete ${TourImageSchema.schemaName}`);

    return result.recordsets;
}