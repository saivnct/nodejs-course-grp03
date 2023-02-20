const C = require('./module-1');
const module2 = require('./module-2');


// const cal = new C();
// console.log(cal.add(1,2));
// console.log(cal.sub(1,2));


// console.log(C(1,2));

console.log(module2.add(1,2));
console.log(module2.sub(1,2));
console.log(module2.PI);

const person = new module2.Person('AG', 10);
person.greet();


