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
    email: {
      type: String,
      required: true,
    },
    number: {
      type: String,
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
    covidCenter: {
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
    covidcenter: {
      type: Schema.Types.ObjectId,
      ref: "Covidcenter",
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Hospital", hospitalSchema);
