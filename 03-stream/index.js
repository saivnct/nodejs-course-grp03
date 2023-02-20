const fs = require("fs");
const http = require("http");

const server = http.createServer((req, res) => {
    //Solution 1: read full file
    //   fs.readFile("test-file.txt", (err, data) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //     res.end(data);
    //   });

    //Solution 2
    const readable = fs.createReadStream("test-file.txt");
    //readable => READABLE STREAM

    readable.on("data", (chunk) => {
        res.write(chunk);
    });

    readable.on("end", () => {
        res.end();
    });

    readable.on("error", (err) => {
        console.log(err);
        res.statusCode = 500;
        res.end("File not found");
    });
});


server.listen(9000, () => {
    console.log("listening on 9000");
});