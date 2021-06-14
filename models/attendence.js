const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendenceSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
  },
  staff: {
    type: Schema.Types.ObjectId,
    ref: "Staff",
  },
  timeIn: {
    type: Date,
    required: true,
  },
  timeOut: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Attendence", attendenceSchema);
