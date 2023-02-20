exports.add = (a,b) => {
    return a+b;
}

exports.sub = (a,b) => {
    return a-b;
}

exports.Person = class  {
    constructor(name,age) {
        this.name = name;
        this.age = age;
    }

    greet(){
        console.log(`hello ${this.name}`);
    }
}

exports.PI = 3.14;