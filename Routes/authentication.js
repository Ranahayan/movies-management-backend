const express = require("express");
const Joi = require("joi");
const _ = require("lodash");
const auth = express.Router();
const bcrypt = require("bcrypt");

const { User } = require("../models/users");

auth.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newUser = await User.findOne({ email: req.body.email });
  if (!newUser) return res.status(400).send("Invalid email or password");

  const { email, password } = req.body;
  console.log(password, newUser.password);
  const authResult = await bcrypt.compare(password, newUser.password);
  if (!authResult) return res.status(400).send("Invalid email or password");

  const token = newUser.generateAuthToken();
  return res.send(token);
});

const validateUser = (req) => {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().required(),
  };

  return Joi.validate(req, schema);
};

module.exports = auth;
