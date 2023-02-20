const EventEmitter = require('events');
const http = require('http');

class Sale extends EventEmitter{
    constructor() {
        super();
    }
}

const sale = new Sale();

sale.on("newSale", (val) => {
    console.log('On newSale 1', val);
});

sale.on("newSale", (val) => {
    console.log('On newSale 2', val);
});

sale.on("newSale", (val) => {
    console.log('On newSale 3', val);
});


sale.emit("newSale", 100);


/////////////////////////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
    console.log('on request');
    res.end("Hello from server");
});

server.on("request", (req, res) => {
    console.log('on request 2');
});

server.on("request", (req, res) => {
    console.log('on request 3');
});

server.listen(8080, () => {
    console.log('Listening on 8080...');
});








