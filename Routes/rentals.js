const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Rental, validate } = require("../models/rentals");
const Fawn = require("fawn");
const { Customer } = require("../models/customers");
const { Movie } = require("../models/movie");

Fawn.init("mongodb://localhost/Vidly");

router.get("/", async (req, res) => {
  const rentals = await Rental.find({});
  res.send(rentals);
  console.log(rentals);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { customerId, movieId } = req.body;

  const customer = await Customer.findById(customerId);
  if (!customer)
    return res.status(400).send("Customer With Given Id Is Not Present");
  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(400).send("Movie With Given Id Is Not Present");

  if (movie.numberInStock === 0)
    return res.status(400).send("This Movie Is Out Of Stock");

  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run({ useMongoose: true });
    res.send(rental);
  } catch (err) {
    return res.status(500).send("Something failed....");
  }
});

// router.put("/:id", async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const { title, genreId, numberInStock, dailyRentalRate } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(genreId))
//     return res.status(404).send("Inavlid Genre...");
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(404).send("Movie is not present");

//   const genres = await Genres.findById(genreId);
//   if (!genres) return res.status(400).send("Inavlid Genre...");

//   const movie = await Rental.findByIdAndUpdate(
//     req.params.id,
//     {
//       title,
//       genres: { _id: genres._id, name: genres.name },
//       numberInStock,
//       dailyRentalRate,
//     },
//     { new: true }
//   );
//   if (!movie) return res.status(404).send("Movie is not present");

//   res.send(movie);
// });

// router.delete("/:id", async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(404).send("Movie is not present");

//   const movie = await Rental.findByIdAndDelete(req.params.id);
//   if (!movie) return res.status(404).send("Movie is not present");
//   res.send(movie);
// });

// router.get("/:id", async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id))
//     return res.status(404).send("Movie is not present");

//   const movie = await Rental.findById(req.params.id);
//   res.send(movie);
// });

module.exports = router;
