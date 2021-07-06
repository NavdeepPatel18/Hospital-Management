const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const avabilitySchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      unique: false,
    },
    slot: [
      {
        type: String,
        required: true,
      },
    ],
    day: {
      type: String,
      ref: "Day",
      unique: false,
    },
  },
  { timestamps: true }
);

avabilitySchema.index({ doctor: 1, day: 1 }, { unique: true });
module.exports = mongoose.model("Avability", avabilitySchema);
