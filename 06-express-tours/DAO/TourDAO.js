const dbConfig = require('./../database/dbconfig');
const sql = require('mssql');
const TourImageDAO = require('./TourImageDAO');
const TourStartDateDAO = require('./TourStartDateDAO');
const TourSchema = require('./../model/Tour');

async function setTourInfo(tour){
    const tourImages = await TourImageDAO.getByTourId(tour.id);
    const tourStartDates = await TourStartDateDAO.getByTourId(tour.id);
    const images = tourImages.map(i => i.imgName);
    const startDates = tourStartDates.map(i => i.date);
    tour.images = images;
    tour.startDates = startDates;
    return tour
}



exports.getAllTours = async (filter) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let query = `SELECT * from Tours`
    let countQuery = `SELECT COUNT(DISTINCT id) as totalItem from Tours`

    const page = filter.page * 1 || 1;
    let pageSize = filter.pageSize * 1 || 10;
    if (pageSize > 10) {
        pageSize = 10;
    }
    const skip = (page - 1) * pageSize;
    let paginationStr = 'ORDER BY';
    let defaultSortStr = `createdAt asc`;
    let sortStr = '';

    const sort = filter.sort;

    delete filter.page;
    delete filter.pageSize;
    delete filter.sort;

    if (filter){
        let filterStr = ''
        let i = 0;
        for (let criteria in filter){
            if (i > 0) {
                filterStr += ' AND '
            }else{
                filterStr += 'WHERE '
            }

            if (
                criteria === 'id' ||
                criteria === 'duration' ||
                criteria === 'maxGroupSize' ||
                criteria === 'ratingsAverage' ||
                criteria === 'ratingsQuantity' ||
                criteria === 'price'
            ){
                if (typeof filter[criteria] === 'object'){
                    let j = 0;
                    for (let criteriaOperator in filter[criteria]){
                        let operator;
                        let criterialVal;
                        if (criteriaOperator === 'gt'){
                            operator = '>'
                            criterialVal = filter[criteria]['gt'];
                        }else if (criteriaOperator === 'gte'){
                            operator = '>='
                            criterialVal = filter[criteria]['gte'];
                        }else if (criteriaOperator === 'lt'){
                            operator = '<'
                            criterialVal = filter[criteria]['lt'];
                        }else if (criteriaOperator === 'lte'){
                            operator = '<='
                            criterialVal = filter[criteria]['lte'];
                        }else if (criteriaOperator === 'eq'){
                            operator = '='
                            criterialVal = filter[criteria]['eq'];
                        }

                        if (operator && criterialVal){
                            if (j > 0) {
                                filterStr += ' AND '
                            }
                            filterStr += criteria + ' ' + operator + ' ' + criterialVal;
                            i++;
                            j++;
                        }
                    }
                }
                else{
                    filterStr += criteria + ' = ' + filter[criteria];
                    i++;
                }
            }else if (
                criteria === 'name' ||
                criteria === 'difficulty'
            ){
                filterStr += criteria + " = '" + filter[criteria] + "'";
                i++;
            }
        }

        query += ' ' + filterStr ;
        countQuery += ' ' + filterStr;
    }


    if (sort){
        let sortCriterias = sort.split(',')
        if (sortCriterias.length > 0){
            // console.log(sortCriterias);
            sortCriterias.forEach(criteria => {
                let sortDirection = 'asc';
                let sortProp = criteria;
                if (criteria.startsWith('-')){
                    sortDirection = 'desc';
                    sortProp = criteria.replace(/^-+/, '')
                }

                sortStr += sortProp + ' ' + sortDirection + ',';
            })
        }
    }

    if (sortStr){
        sortStr = sortStr.slice(0, -1); //delete last ','
    }else{
        sortStr = defaultSortStr;
    }

    //offset 0 ROWS FETCH NEXT 10 ROWS ONLY;
    paginationStr += ' ' + sortStr + ' OFFSET ' + skip +
        ' ROWS FETCH NEXT ' + pageSize + ' ROWS ONLY'


    query += ' ' + paginationStr;

    console.log(query);


    let request = dbConfig.db.pool.request();
    const result = await request.query(query);
    let countResult = await dbConfig.db.pool.request().query(countQuery);

    let totalItem = 0;
    if (countResult.recordsets[0].length > 0) {
        totalItem = countResult.recordsets[0][0].totalItem;
    }
    let totalPage = Math.ceil(totalItem/pageSize); //round up

    const tours = result.recordsets[0];
    for (let i = 0 ; i < tours.length; i++){
        const tour = tours[i];
        const images = await TourImageDAO.getByTourId(tour.id);
        const startDates = await TourStartDateDAO.getByTourId(tour.id);
        tour.images = images.map(i => i.imgName);
        tour.startDates = startDates.map(d => d.date);
    }

    // console.log(result);
    return {
        page,
        pageSize,
        totalPage,
        totalItem,
        tours
    };
}


exports.getTourById = async (id) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request
        .input(`${TourSchema.schema.id.name}`, TourSchema.schema.id.sqlType, id)
        .query(`select * from ${TourSchema.schemaName} where ${TourSchema.schema.id.name} = @${TourSchema.schema.id.name}`);

    const tour = await setTourInfo(result.recordsets[0][0]);
    return tour;
}

exports.getTourByName = async (name) => {
    if (!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }

    let request = dbConfig.db.pool.request();

    let result = await request
        .input(`${TourSchema.schema.name.name}`, TourSchema.schema.name.sqlType, name)
        .query(`select * from ${TourSchema.schemaName} where ${TourSchema.schema.name.name} = @${TourSchema.schema.name.name}`);

    // console.log(result);

    return result.recordsets[0][0];
}

exports.deleteTourById = async (id) => {
    if(!dbConfig.db.pool){
        throw new Error('Not connected to db');
    }
    let request = dbConfig.db.pool.request();
    let result = await request
        .input(`${TourSchema.schema.id.name}`, TourSchema.schema.id.sqlType, id)
        .query(`delete ${TourSchema.schemaName} where ${TourSchema.schema.id.name} = @${TourSchema.schema.id.name}`)

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

    let request = dbConfig.db.pool.request();
    let result = await request
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
        .query(`insert into ${TourSchema.schemaName} ` +
            '(name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover) ' +
            'values ' +
            '(@name, @duration, @maxGroupSize, @difficulty, @ratingsAverage, @ratingsQuantity, @price, @summary, @description, @imageCover)');


    // console.log(result);
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

    let query = `update ${TourSchema.schemaName} set`;

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

    let result = await dbConfig.db.pool.request().query(`delete ${TourSchema.schemaName}`);

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
        .query(
            `SET IDENTITY_INSERT ${TourSchema.schemaName} ON ` +
            `insert into ${TourSchema.schemaName} ` +
            '(id, name, duration, maxGroupSize, difficulty, ratingsAverage, ratingsQuantity, price, summary, description, imageCover) ' +
            'SELECT @id, @name, @duration, @maxGroupSize, @difficulty, @ratingsAverage, @ratingsQuantity, @price, @summary, @description, @imageCover ' +
            `WHERE NOT EXISTS(SELECT * FROM ${TourSchema.schemaName} WHERE id = @id)`);
    // console.log(result);
    return result.recordsets;
}