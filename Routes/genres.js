const express = require("express");
const router = express.Router();
const auth = require("../authorization-middlware/auth");
const mongoose = require("mongoose");
const { Genres, validateGenre } = require("../models/genres");
const admin = require("../authorization-middlware/admin");
const asyncMiddleware = require("../authorization-middlware/asyncMiddleware");

// ------------------------------------------------Get All Genres----------------------------------------------------

router.get("/", async (req, res) => {
  throw new Error("Could not get the genres");
  const genres = await Genres.find({});
  res.send({name: 'Hayan'});
});

// ------------------------------------------------Add New Genres----------------------------------------------------
router.post("/", auth, async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genres({
    name: req.body.name,
  });

  try {
    const result = await genre.save();
    res.send(result);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// ------------------------------------------------Update Genres----------------------------------------------------
router.put("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("The genre with the given ID was not found.");
  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  genre.name = req.body.name;

  try {
    const result = await genre.save();
    res.send(result);
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

// ------------------------------------------------Delete Genres----------------------------------------------------
router.delete("/:id", [auth, admin], async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Inavlid genre id.");
  const genre = await Genres.findByIdAndDelete(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

// ------------------------------------------------Get One Genres----------------------------------------------------
router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("The genre with the given ID was not found.");

  const genre = await Genres.findById(req.params.id);
  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");
  res.send(genre);
});

module.exports = router;
