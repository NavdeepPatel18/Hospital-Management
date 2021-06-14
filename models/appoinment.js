const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appoinmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  problem: {
    type: String,
    required: true,
  },
  bp: {
    type: String,
  },
  caseType: {
    type: String,
    required: true,
  },
  suger: {
    type: Number,
  },
  allergy: {
    type: String,
  },
  history: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  tocken: {
    type: Number,
    required: true,
  },
  conformby: {
    type: String,
  },
  status: {
    type: String,
  },
  statusDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Appoinment", appoinmentSchema);
