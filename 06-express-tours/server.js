const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
})


const app = require('./app');

const sql = require('mssql');
const sqlConfig = {
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASS,
    server: 'localhost',
    port: 1433,
    database: process.env.MSSQL_HOST,
    options: {
        encrypt: false, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
}


//START SERVER
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App running on port ${PORT}...`);
});