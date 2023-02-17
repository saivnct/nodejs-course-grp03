const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res) => {
    console.log(req.url);
    const pathname =req.url;
    if (pathname === '/overview'){
        //NOTE: DONT LOCK EVENT LOOP BY SYNCHRONOUS READING -> USING ASYNCHRONOUS INSTEAD
        // fs.readFileSync();
        fs.readFile('./templates/overview.html','utf-8', (err, data) => {
            res.writeHead(200,
                {
                    'Content-type': 'text/html',
                });
            res.end(data);
        });
    }else if (pathname === '/product'){
        fs.readFile('./templates/product.html','utf-8', (err, data) => {
            res.writeHead(200,
                {
                    'Content-type': 'text/html',
                });
            res.end(data);
        });
    } else {
        res.writeHead(404,
            {
                'Content-type': 'text/html',
            }); //set res with status code = 404 and header with 'Content-type= tex/html'
        res.end('<h1>Page not found</h1>')
    }
});

server.listen(8080,()=>{
    console.log('Listening on 8080...');
});