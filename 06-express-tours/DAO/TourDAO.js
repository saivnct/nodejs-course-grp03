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
exports.deleteTourById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('id', sql.Int, id)
        .query('delete * from Tours where id = @id');

    console.log(result);
//     return result
}

exports.createNewTour = async(name, price) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input('name', sql.varchar, name)
        .input('price', sql.Int, price)
        .query('insert into Tours (name, price) values (@name,@price)');
    console.log(result);
    // return result
}
exports.updateTourById = async (id, updateInfo) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request.input('id', sql.Int, id)
        .input('price', sql.Int, price)
        .input('rating', sql.float, rating)
        .query('update Tours set price = @price, rating = @rating where id = @id');

    console.log(result);
    // return result

}