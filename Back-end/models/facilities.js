const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const facilitiesSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hospital: {
    type: Schema.Types.ObjectId,
    ref: "Hospital",
  },
});

module.exports = mongoose.model("FacilitiesPhoto", facilitiesSchema);
