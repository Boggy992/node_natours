const mongoose = require('mongoose');
const slugify = require('slugify');
// biblioteka za validiranje
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have less or equal then 40 characters'],
      minLength: [10, 'A tour must have more or equal then 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      // CUSTOM VALIDATOR
      // function validate needs to return true or false or object
      // priceDiscount = val
      // {VALUE} u stringu ima potpuno istu vrednost kao val parametar(eg. priceDiscount);
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: "Discount <{VALUE}> can't be higher or equal then price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    // Array of strings
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // stavljanjem select: false iskljucujemo poverljiva polja iz sheme da se ne prikazuju
      select: false,
    },
    startDates: [Date],
    secretTour: Boolean,
  },
  // bez ovih parametara virtual properties nece raditi
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE
// <pre> runs before .save() and .create() - (post metoda) but not on .findById, .insertMany, .insertOne...
// 'save' je u ovom slucaju HOOK
// middleware koji upucuje na dokument
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
