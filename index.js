require("express-async-errors");
const Joi = require("joi");
const express = require("express");
const app = express();
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");
const { request } = require("express");
const { createLogger, transports } = require("winston");

require("./startup/routes")(app);

const logger = createLogger();
logger.add(
  new transports.File({
    filename: "combined.log",
  }),
  new transports.Console()
);

process.on("uncaughtException", (ex) => {
  console.log("Some thing failed during startup");
  logger.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("we got an unhandled rejection");
  logger.error(ex.message, ex);
  process.exit(1);
});

// const p = Promise.reject(new Error("Some thing failed miserably"));
// p.then(() => console.log("Done"));

// throw new Error("some thing failed during startup");

if (!config.get("jwtprivatekey")) {
  console.log("FETAL ERROR! jwtprivatekey is not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/Vidly")
  .then((result) => console.log("Connected"))
  .catch((error) => console.log("Error", error.message));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
