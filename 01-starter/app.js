const http = require('http');
const fs = require('fs');
const url = require('url');

//METHOD 2: Read file on starting server -> save data to a variable
const templateOverview = fs.readFileSync(`${__dirname}/templates/overview.html`,'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/card.html`,'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/product.html`,'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataArr = JSON.parse(data);
// console.log(dataArr);


const replaceTemplate = (template, product) => {
    //using replace by regular expression  - g means global
    //template => String
    //product => JS Object
    let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }

    return output;
}


const server = http.createServer((req,res) => {
    // console.log(req.url);

    // console.log(url.parse(req.url, true)); //parse query string into object

    // const urlInfo =  url.parse(req.url, true);
    // const pathname = urlInfo.pathname;
    // const query = urlInfo.query;

    //Object destructuring
    const {pathname, query} =  url.parse(req.url, true);


    if (pathname === '/overview'){
        //NOTE: DONT LOCK EVENT LOOP BY SYNCHRONOUS READING -> USING ASYNCHRONOUS INSTEAD
        // fs.readFileSync();
        //METHOD 1: Read file on demand -> when a request come to our server -> read file and send response to user
        // fs.readFile('./templates/overview.html','utf-8', (err, data) => {
        //     res.writeHead(200,
        //         {
        //             'Content-type': 'text/html',
        //         });
        //     res.end(data);
        // });

        //METHOD 2: Read file on starting server -> save data to a variable
        // res.writeHead(200,
        // {
        //     'Content-type': 'text/html',
        // });
        // res.end(templateOverview);

        res.writeHead(200,
        {
            'Content-type': 'text/html',
        });

        // let cardsHtml = [];
        // for (let i = 0; i < dataArr.length; i++){
        //     const product = dataArr[i];
        //     const cardHtml = replaceTemplate(templateCard, product);
        //     cardsHtml.push(cardHtml)
        // }

        const cardsHtml = dataArr.map( product => replaceTemplate(templateCard, product));

        const cardsHtmlText = cardsHtml.join('');
        let output = templateOverview.replace(/{%PRODUCT_CARDS%}/g,cardsHtmlText);
        res.end(output);
    }
    else if (pathname === '/product'){
        const id = query.id * 1;
        const product = dataArr[id];
        res.writeHead(200,
        {
            'Content-type': 'text/html',
        });
        let output = replaceTemplate(templateProduct, product);
        res.end(output);
    }else if (pathname === '/api'){
        res.writeHead(200,
            {
                'Content-type': 'application/json',
            });
        res.end(data);
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