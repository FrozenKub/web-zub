const logFile = './logs/server.log';
const fs = require('fs');
function logRequestToConsole(req, res, next) {
    let date = new Date();
    let logData = `${date} ${req.method} request at ${req.url} `;
    console.log(logData);

    next();
}

function logErrorsToFile(err, req, res, next) {
    let date = new Date();

    let logData = `${date} ${err.name} at ${req.url}\n`;

    fs.appendFile(logFile, logData, function (err) {
    })
}

exports.logErrorsToFile = logErrorsToFile;
exports.logRequestToConsole = logRequestToConsole;