const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    givenBy: {
      type: String,
      required: true,
    },
    feedbackText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
  },
  { timestamp: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
