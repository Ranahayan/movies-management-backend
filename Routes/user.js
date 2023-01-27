const express = require("express");
const _ = require("lodash");
const users = express.Router();
const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/users");
const auth = require("../authorization-middlware/auth");

users.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

users.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let newUser = await User.findOne({ email: req.body.email });
  if (newUser) return res.status(400).send("User already exists");

  const { name, email, password, isAdmin } = req.body;

  newUser = new User({ name, email, password, isAdmin });
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);
  try {
    await newUser.save();
  } catch (err) {
    return res.status(400).send(err.message);
  }
  const token = newUser.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(newUser, ["_id", "name", "email"]));
});

module.exports = users;
