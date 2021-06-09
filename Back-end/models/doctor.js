const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const doctorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    hospital: {
      type: Schema.Types.ObjectId,
      ref: "Hospital",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
