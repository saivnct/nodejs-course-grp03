const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
})


const app = require('./app');

const sql = require('mssql');
const sqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: process.env.MSSQL_HOST,
    port: process.env.MSSQL_PORT*1 || 1433,
    database: process.env.MSSQL_DB,
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}

//https://www.npmjs.com/package/mssql#asyncawait => Global Pool Single Instance
const appPool = new sql.ConnectionPool(sqlConfig);
appPool.connect()
    .then(function(pool) {
        console.log('SQL Connected!');
    }).catch(function(err) {
        console.error('Error creating connection pool', err)
    });





//START SERVER
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App running on port ${PORT}...`);
});