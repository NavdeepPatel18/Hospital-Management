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
  oxygen: {
    type: Boolean,
    required: true,
  },
  ventilator: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Covidcenter", covidcenterSchema);
