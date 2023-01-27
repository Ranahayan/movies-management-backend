const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const validateEmail = function (email) {
  var regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regEmail.test(email);
};

const userSchema = new mongoose.Schema({
  name: { type: String, minlength: 3, maxlength: 20, required: true },
  email: {
    type: String,
    trim: true,
    lowerCase: true,
    required: "Email is required",
    validate: {
      validator: validateEmail,
      message: "Please enter valid email",
    },
  },
  password: {
    type: String,
    required: "Password is required",
  },
  isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    config.get("jwtprivatekey")
  );
  return token;
};

const User = mongoose.model("users", userSchema);

const validateUser = (user) => {
  const schema = {
    name: Joi.string().min(5).max(20).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }),
    password: Joi.string().required(),
    isAdmin: Joi.boolean(),
  };

  return Joi.validate(user, schema);
};

exports.User = User;
exports.validateUser = validateUser;
