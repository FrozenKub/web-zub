const {Sequelize} = require('sequelize');
const argon = require('argon2');

const sequelize = new Sequelize('first', 'tom', '1234', {
    host: 'db.dev',
    dialect: 'postgres'
});

const userModel = require('./models/user')(sequelize, Sequelize);

async function connectToDatabase() {
    try {
        await sequelize.authenticate();
        console.log('CONNECTION ESTABLISHED! ENTERING ENEMY LOCATION!');
    } catch (error) {
        console.error('CONNECTION LOST! DATABASE IS OUT OF RANGE!', error);
    }
}

async function findUser(username) {
    return await userModel.findOne({
        where: {
            username: username
        }
    });
}

async function findUserById(id) {
    return await userModel.findOne({
        where: {
            id: id
        }
    });
}

async function isUserExist(username) {
    let user = await findUser(username);
    return (user !== undefined && user !== null);
}

async function getUserPassword(username) {
    let user = await findUser(username);
    return user.password;
}

async function createNewUser(username, password) {
    const hashedPassword = await argon.hash(password);

    let res = await argon.verify(hashedPassword, password);

    if (res) {
        let newUser = userModel.build({
            username: username,
            password: hashedPassword
        });


        return await newUser.save();

    }

    return undefined;

}

async function updateData(req, res, next) {

    let user = await findUserById(req.user.id);

    const body = req.body;
    if (body) {
        console.log(body);
        if (body.password) {
            console.log("PASSWORD CHANGE");
            user.password = body.password;
        }

        await user.save();
    }


    next();
}

exports.connectToDatabase = connectToDatabase;
exports.sequelize = sequelize;
exports.findUser = findUser;
exports.getUserPassword = getUserPassword;
exports.isUserExist = isUserExist;
exports.User = userModel;
exports.createNewUser = createNewUser;
exports.findUserById = findUserById;