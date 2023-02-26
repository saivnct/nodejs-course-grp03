const app = require('./app');

const dotenv = require('dotenv');

dotenv.config({
    path: './config.env'
})



//START SERVER
const PORT = process.env.PORT;
app.listen(PORT,() => {
    console.log(`App running on port ${PORT}...`);
});