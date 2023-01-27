const { createLogger, transports } = require("winston");
const MongoDB = require("winston-mongodb").MongoDB;

const logger = createLogger({
  transports: [
    new transports.File({
      filename: "error.log",
      level: "info", //this means upto info level, messages will be logged.it means
      //that message of errors and warning will alos be logged.
    }),
    new MongoDB({
      db: "mongodb://localhost/Vidly",
      level: "info",
    }),
    new transports.Console(),
  ],
});
module.exports = function (err, req, res, next) {
  logger.error(err.message, err);
  //Log the exception
  res.status(500).send("Something failed");
};
