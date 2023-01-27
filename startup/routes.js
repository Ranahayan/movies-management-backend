const express = require("express");
const genres = require("../Routes/genres");
const customer = require("../Routes/customer");
const movie = require("../Routes/movies");
const rental = require("../Routes/rentals");
const users = require("../Routes/user");
const auth = require("../Routes/authentication");
const error = require("../authorization-middlware/error.js");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customer);
  app.use("/api/movies", movie);
  app.use("/api/rentals", rental);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
