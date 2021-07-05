const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const covidcenterSchema = new Schema({
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
  },
  totalbed: {
    type: Number,
    required: true,
  },
  vacantbed: {
    type: Number,
    required: true,
  },
  icubed: {
    type: Number,
    required: true,
  },
  oxygen: {
    type: Number,
    required: true,
  },
  ventilator: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Covidcenter", covidcenterSchema);
