const express = require("express");
const customer = express.Router();

const { Customer, validateCustomer } = require("../models/customers");

// ------------------------------------------------Get All Customers----------------------------------------------------
customer.get("/", async (req, res) => {
  const customers = await Customer.find({}).sort({ name: 1 });
  res.send(customers);
});

// ------------------------------------------------Add New Customer----------------------------------------------------
customer.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, phoneNo, isGold } = req.body;
  const customer = new Customer({
    name,
    phoneNo,
    isGold,
  });
  try {
    const result = await customer.save();
    res.send(result);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// ------------------------------------------------Update Customers----------------------------------------------------
customer.put("/:id", async (req, res) => {

  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, phoneNo, isGold } = req.body;

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name,
      phoneNo,
      isGold,
    },
    { new: true }
  );
  console.log(customer);
  if (!customer)
    return res.status(400).send("Customer of given ID is not present");

  return res.send(customer);
});

// ------------------------------------------------Delete Customers----------------------------------------------------
customer.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
  return res.status(404).send("The customer with the given ID was not found.");
  const customer = await Customer.findByIdAndRemove(req.params.id);

  if (!customer)
    return res.status(400).send("Customer of given ID is not present");

  res.send(customer);
});

// ------------------------------------------------Get One Customers----------------------------------------------------
customer.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
  return res.status(404).send("The customer with the given ID was not found.");
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(400).send("Customer of given ID is not present");

  res.send(customer);
});

module.exports = customer;
