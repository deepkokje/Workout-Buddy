const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    reps: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Schema define the structure of the documents that we save to that collection
// Use the model to interact with a collection of that name (Ex. Workout model for interacting with Workout collection)
// define the structure of the doc of a collection by adding the schema to the model
module.exports = mongoose.model("Workout", workoutSchema);
