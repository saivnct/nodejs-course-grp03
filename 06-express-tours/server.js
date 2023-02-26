const dotenv = require('dotenv');
dotenv.config({
    path: './config.env'
})


const app = require('./app');

const sql = require('mssql');
const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    server: 'localhost',
    port: 1433,
    database: process.env.DB_NAME,
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