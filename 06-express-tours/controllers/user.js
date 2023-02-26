const fs = require('fs');
const data = fs.readFileSync(`${__dirname}/../dev-data/data/users.json`,'utf-8');
const userArr = JSON.parse(data);

exports.getAllUser = (req, res) => {
    res.status(200).json({
        code: 200,
        msg: 'Get all user successfully!',
        data: {userArr}
    })
}

exports.getUserById = (req, res) => {
    const id = req.params.id * 1;
    const userData = userArr[id];
    console.log('User get by Id', userData);
    res
        .status(200)
        .json({
            code: 200,
            msg: 'Get user by id successfully',
            data: userData
        })
}

exports.createNewUser = (req, res) => {
    const newUser = req.body;
    userArr.push(newUser);
    fs.writeFile('./dev-data/data/users.json', JSON.stringify(userArr), (err) => {
        if (err) {
            res
                .status(500)
                .json({
                    code: 500,
                    msg: `Add new user fail!`
                });
        }
        res
            .status(201)
            .json({
                code: 201,
                msg: `Add new tour successfully!`,
                data: newUser
            });
    })
}

exports.deleteUserById = (req, res) => {
    const id = req.params.id * 1;
    const index = userArr.findIndex((user) => {return user.id === id});
    if (index < 0){
        res
            .status(404)
            .json({
                code: 404,
                msg:`Not found user with ${id}!`,
            })
    }
    const delUser = userArr[index];
    userArr.splice(index,1);
    console.log('User delete by id', delUser);

    fs.writeFile('./dev-data/data/users.json', JSON.stringify(userArr), (err) => {
        res
            .status(200)
            .json({
                code: 200,
                msg:`Delete user with ${id} successfully!`
            })
        })
}

exports.updateUserById = (req, res) => {
    const id = req.params.id * 1;
    const updateInfo = req.body;
    const index = userArr.findIndex((user) => {return user.id === id});

    if (index < 0){
        return res.status(404)
            .json({
                code: 404,
                msg: `Not found user with ${id}!`
            })
    }

    const userUpdate = userArr[index];
    if (updateInfo.name){
        userUpdate.name = updateInfo.name;
    }

    if (updateInfo.checkEmail(updateInfo.email) === true ){
        userUpdate.email = updateInfo.email;
    }

    if (updateInfo.role){
        userUpdate.role = updateInfo.role;
    }

    if (typeof updateInfo.active === 'boolean'){
        userUpdate.active = updateInfo.active;
    }

    if (updateInfo.photo){
        userUpdate.photo = updateInfo.photo;
    }

    if (updateInfo.password){
        userUpdate.password = updateInfo.password;
    }

    fs.writeFile('./dev-data/data/users.json', JSON.stringify(userArr) , (err) => {
        if (err) {
            res
                .status(500)
                .json({
                    code: 500,
                    msg: `Update id: ${id} fail!`
                });
        }
        res
            .status(200)
            .json({
                code: 200,
                msg: `Update id: ${id} successfully!`
            });
    })
}