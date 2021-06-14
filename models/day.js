const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const daySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  avability: [
    {
      type: Schema.Types.ObjectId,
      ref: "Avability",
    },
  ],
});

module.exports = mongoose.model("Day", daySchema);
