const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    userType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["Unseen", "Seen"],
        message: "{VALUE} is not supported",
      },
      default: "Unseen",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
