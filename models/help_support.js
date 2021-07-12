const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const helpsupportSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    user: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("HelpSupport", helpsupportSchema);
