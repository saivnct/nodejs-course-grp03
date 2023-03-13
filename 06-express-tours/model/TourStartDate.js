const ModelSchema = require('./ModelSchema');
const ModelSchemaValidator = require('./ModelSchemaValidator');
const sql = require('mssql');

const TourStartDateSchema = new ModelSchema(
    {
        tourId: new ModelSchemaValidator({
            name: 'tourId',
            sqlType: sql.Int,
        }),
        date: new ModelSchemaValidator({
            name: 'date',
            sqlType: sql.DateTime,
        })
    }, 'TourStartDate'
)
module.exports = TourStartDateSchema;