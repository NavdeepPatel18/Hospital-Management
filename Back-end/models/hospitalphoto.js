const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hospitalphotoSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
  },
});

module.exports = mongoose.model("HospitalPhoto", hospitalphotoSchema);
