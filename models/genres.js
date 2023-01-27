const Joi = require("joi");
const mongoose = require("mongoose");
 
const genresSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 20 },
});
const Genres = mongoose.model("genres", genresSchema);

function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

exports.Genres = Genres;
exports.genresSchema = genresSchema;
exports.validateGenre = validateGenre;
