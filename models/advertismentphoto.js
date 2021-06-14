const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const advertismentphotoSchema = new Schema({
  photo: {
    type: String,
    required: true,
  },
  advertisment: {
    type: Schema.Types.ObjectId,
    ref: "Advertisment",
  },
});

module.exports = mongoose.model("AdvertismentPhoto", advertismentphotoSchema);
