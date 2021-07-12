const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: Date,
    required: true,
  },
  advertisment: {
    type: Schema.Types.ObjectId,
    ref: "Advertisment",
  },
});

module.exports = mongoose.model("Payment", paymentSchema);
