const http = require('http');

const server = http.createServer((req,res) => {
    console.log(req.url);

    const pathname = req.url;
    if (pathname === '/overview'){
        res.end('THIS IS OVERVIEW PAGE');
    }else if (pathname === '/product'){
        res.end('THIS IS PRODUCT PAGE');
    }else{
        res.writeHead(404, {    //not found
            'Content-type': 'text/html',
        });//set response with status code = 404 and header with 'Content-type' = 'text/html'

        res.end('<h1>Page not found!!!!</h1>')
    }
});

server.listen(8080, () => {
    console.log('Listening on 8080 ...');
});