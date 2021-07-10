const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appoinmentSchema = new Schema(
  {
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: Number,
      required: true,
    },
    problem: {
      type: String,
      required: true,
    },
    bp: {
      type: Number,
      default: 0,
    },
    caseType: {
      type: String,
      required: true,
      enum: {
        values: ["Old", "New"],
        message: "{VALUE} is not supported",
      },
    },
    suger: {
      type: Number,
      default: 0,
    },
    allergy: {
      type: String,
      default: "NA",
    },
    history: {
      type: String,
      default: "NA",
    },
    date: {
      type: Date,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    acceptedby: {
      type: String,
      required: true,
      default: "Not Accepted",
    },
    appoinmentstatus: {
      type: String,
      enum: {
        values: ["Pendding", "Accept", "Reject"],
        message: "{VALUE} is not supported",
      },
      default: "Pendding",
    },
    status: {
      type: String,
      enum: {
        values: ["Visited", "Not Visited", "Cancle"],
        message: "{VALUE} is not supported",
      },
      default: "Not Visited",
    },
    userstatus: {
      type: String,
      enum: {
        values: ["Booked", "Cancle"],
        message: "{VALUE} is not supported",
      },
      default: "Booked",
    },
    statusDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appoinment", appoinmentSchema);
