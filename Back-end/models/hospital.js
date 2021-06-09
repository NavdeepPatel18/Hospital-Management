const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hospitalSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    name: {
      type: String,
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
    number1: {
      type: Number,
      required: true,
    },
    number2: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    photo: [
      {
        type: Schema.Types.ObjectId,
        ref: "Hospitalphoto",
      },
    ],
    facilities: {
      type: Schema.Types.ObjectId,
      ref: "Facilities",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
