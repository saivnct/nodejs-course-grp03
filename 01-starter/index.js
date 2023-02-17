const fs = require('fs');

//read file synchronous
// const text = fs.readFileSync("./txt/input.txt","utf-8");
// console.log(text);

//read file asynchronous
// fs.readFile("./txt/input.txt", "utf-8", (err, data) => {
//     console.log(data);
// });
// console.log('hello world');

//write file synchronous
const textOut = "123456";
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log('file written');


//write file asynchronous
fs.writeFile("./txt/output.txt", textOut, (err) => {
    console.log('file written');
});
console.log('hello world');



