const ModelSchema = require('./ModelSchema');
const ModelSchemaValidator = require('./ModelSchemaValidator');
const sql = require("mssql");

const TourImageSchema = new ModelSchema(
    {
        tourId: new ModelSchemaValidator({
            name: 'tourId',
            sqlType: sql.Int,
        }),

        imgName: new ModelSchemaValidator({
            name: 'imgName',
            sqlType: sql.VarChar,
        })
    }, 'TourImage'
)

module.exports = TourImageSchema;