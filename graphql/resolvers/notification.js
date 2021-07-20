const Notification = require("../../models/notification");

module.exports = {
  notification: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType === "DOCTOR" || req.userType === "STAFF") {
      try {
        var doctorId = req.userId;
        if (req.userType === "STAFF") {
          const findStaff = await Staff.findOne({ _id: req.userId });
          doctorId = findStaff.doctor;
        }
        const notifications = await Notification.find({ doctor: doctorId });
        return notifications.map((onenotification) => {
          return {
            ...onenotification._doc,
            _id: onenotification.id,
          };
        });
      } catch (err) {
        console.log(err);
      }
    }

    if (req.userType === "USER") {
      try {
        const notifications = await Notification.find({ user: req.userId });
        return notifications.map((onenotification) => {
          return {
            ...onenotification._doc,
            _id: onenotification.id,
          };
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
    if (req.userType === "ADMIN") {
      try {
        const notifications = await Notification.find({ admin: req.userId });
        return notifications.map((onenotification) => {
          return {
            ...onenotification._doc,
            _id: onenotification.id,
          };
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    } else {
      throw new Error("Something went wrong , Please try again later!");
    }
  },
};
