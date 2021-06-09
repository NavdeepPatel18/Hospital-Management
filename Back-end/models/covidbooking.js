const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const covidBookingSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  center: {
    type: Schema.Types.ObjectId,
    ref: "Covidcenter",
  },
  bedno: {
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
  dateIn: {
    type: Date,
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("CovidBooking", covidBookingSchema);
