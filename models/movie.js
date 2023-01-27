const mongoose = require("mongoose");
const Joi = require("joi");
const { genresSchema } = require("./genres");

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, min: 3 },
  genres: { type: genresSchema, required: true },
  numberInStock: { type: Number, required: true, min: 0, max: 255 },
  dailyRentalRate: { type: Number, required: true, min: 0, max: 255 },
});

const Movie = mongoose.model("Movies", movieSchema);

const validateMovie = (movie) => {
  const schema = {
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(255).required(),
    dailyRentalRate: Joi.number().min(0).max(255).required(),
  };
  return Joi.validate(movie, schema);
};

exports.Movie = Movie;
exports.validateMovie = validateMovie;
