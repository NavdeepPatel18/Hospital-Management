const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const covidAppoinmentSchema = new Schema(
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
    center: {
      type: Schema.Types.ObjectId,
      ref: "Covidcenter",
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    token: {
      type: Number,
      required: true,
      unique: true,
    },
    bedno: {
      type: Number,
      required: true,
    },
    oxygen: {
      type: Boolean,
      required: true,
    },
    ventilator: {
      type: Boolean,
      required: true,
    },
    dateIn: {
      type: Date,
      required: true,
    },
    dateOut: {
      type: Date,
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
        values: ["Pendding","Visited", "Not Visited", "Cancle"],
        message: "{VALUE} is not supported",
      },
      default: "Pendding",
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

module.exports = mongoose.model("CovidAppoinment", covidAppoinmentSchema);
