const mongoose = require("mongoose");
const Joi = require("joi");
 Joi.objectId = require('joi-objectid')(Joi)

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5, maxlength: 20 },
  phoneNo: { type: String, required: true, minlength: 10, maxlength: 10 },
  isGold: { type: Boolean, required: true },
});

const Customer = mongoose.model("customers", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(20).required(),
    phoneNo: Joi.string()
      .length(10)
      .regex(/^\d[0-9]+$/)
      .required(),
    isGold: Joi.boolean().required(),
  };

  return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;
