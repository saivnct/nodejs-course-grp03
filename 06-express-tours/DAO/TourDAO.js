const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');


exports.getAllTours = async () => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request.query('select * from Tours');

    // console.log(result);

    return result.recordsets[0];
}


exports.getTourById = async (id) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request
        .input('id', sql.Int, id)
        .query('select * from Tours where id = @id');

    // console.log(result);

    return result.recordsets[0][0];
}