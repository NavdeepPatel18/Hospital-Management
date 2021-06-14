const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const avabilitySchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  slot: {
    type: String,
    required: true,
  },
  day: {
    type: Schema.Types.ObjectId,
    ref: "Day",
  },
});

module.exports = mongoose.model("Avability", avabilitySchema);
