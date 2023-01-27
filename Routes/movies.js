const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movie, validateMovie } = require("../models/movie");
const { Genres } = require("../models/genres");

router.get("/", async (req, res) => {
  const movies = await Movie.find({}).sort({ title: 1 });
  res.send(movies);
  console.log(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { title, genreId, numberInStock, dailyRentalRate } = req.body;
  const genres = await Genres.findById(genreId);
  if (!genres)
    return res.status(400).send("Genre With Given Id Is Not Present");

  const movie = new Movie({
    title,
    genres: { _id: genres._id, name: genres.name },
    numberInStock,
    dailyRentalRate,
  });

  await movie.save();
  res.send(result);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { title, genreId, numberInStock, dailyRentalRate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Movie With Given Id Is Not Present");

  const genres = await Genres.findById(genreId);
  if (!genres)
    return res.status(400).send("Genre With Given Id Is Not Present");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title,
      genres: { _id: genres._id, name: genres.name },
      numberInStock,
      dailyRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("Movie With Given Id Is Not Present");

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Movie With Given Id Is Not Present");

  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).send("Movie With Given Id Is Not Present");
  res.send(movie);
});

router.get("/:id", async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send("Movie With Given Id Is Not Present");

  const movie = await Movie.findById(req.params.id);
  res.send(movie);
});

module.exports = router;
