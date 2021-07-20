const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const Attendence = require("../../models/attendence");
const Appoinment = require("../../models/appoinment");
const CovidAppoinment = require("../../models/covidappoinment");
const Review = require("../../models/review");
const Feedback = require("../../models/feedback");
const HelpSupport = require("../../models/help_support");

const { dateToString } = require("../../helpers/date");

const {
  singledoctor,
  singleuser,
  singlecovidappoinment,
  singleappoinment,
} = require("./merge");

var start = new Date();
start.setHours(0, 0, 0, 0);

var end = new Date();
end.setHours(23, 59, 59, 999);

module.exports = {
  doctorlogin: async ({ username, password }) => {
    try {
      const doctor = await Doctor.findOne({ email: username });
      const staff = await Staff.findOne({ email: username });
      if (!staff && !doctor) {
        throw new Error("Email is incorrect!");
      } else if (doctor) {
        if (doctor.status !== "approved") {
          throw new Error("Admin not approved !!! Please contact to Admin!");
        }
        const isEqual = await bcrypt.compare(password, doctor.password);
        if (!isEqual) {
          throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
          { userId: doctor.id, email: doctor.email, userType: "DOCTOR" },
          "superkey",
          {
            expiresIn: "1d",
          }
        );

        return {
          userId: doctor.id,
          token: token,
          userType: "DOCTOR",
        };
      } else if (staff) {
        if (staff.status !== "Working") {
          throw new Error("sorry , you drop that job");
        }
        const isEqual = await bcrypt.compare(password, staff.password);
        if (!isEqual) {
          throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
          { userId: staff.id, email: staff.email, userType: "STAFF" },
          "superkey",
          {
            expiresIn: "1d",
          }
        );

        return {
          userId: staff.id,
          token: token,
          userType: "STAFF",
        };
      } else {
        throw new Error("Some thing went wrong");
      }
    } catch (err) {
      throw err;
    }
  },

  updateDoctorStaff: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const result = await Staff.findOneAndUpdate(
        { _id: [args.staffId, req.userId] },
        {
          name: args.updateStaff.name,
          email: args.updateStaff.email,
          phone: args.updateStaff.phone,
          designation: args.updateStaff.designation,
        },
        {
          omitUndefined: true,
          new: true,
        }
      );

      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  attendence: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    var status = true;
    if (args.status === "Out") {
      status = false;
    }

    if (req.userType === "DOCTOR") {
      try {
        await Doctor.findByIdAndUpdate(
          { _id: req.userId },
          {
            inoutStatus: status,
          },
          {
            omitUndefined: true,
            new: true,
          }
        );

        const addAttendence = new Attendence({
          doctor: req.userId,
          status: args.status,
        });
        const result = await addAttendence.save();

        return { ...result._doc, _id: result.id };
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const doctor = await Staff.findById({ _id: req.userId });
        await Doctor.findByIdAndUpdate(
          { _id: doctor.doctor },
          {
            inoutstatus: status,
          },
          {
            omitUndefined: true,
            new: true,
          }
        );

        const addAttendence = new Attendence({
          staff: req.userId,
          status: args.status,
        });
        const result = await addAttendence.save();

        return { ...result._doc, _id: result.id };
      } catch (err) {
        throw err;
      }
    }
  },
  attendenceLog: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        const results = await Attendence.find({
          createdAt: { $gte: start, $lt: end },
          doctor: req.userId,
        });
        console.log(results);
        return results.map((result) => {
          return {
            ...result._doc,
            _id: result.id,
            createdAt: dateToString(result._doc.createdAt),
            updatedAt: dateToString(result._doc.updatedAt),
          };
        });
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const doctor = await Staff.findById({ _id: req.userId });
        const results = await Attendence.find({
          createdAt: { $gte: start, $lt: end },
          doctor: doctor.doctor,
        });
        console.log(results);
        return results.map((result) => {
          return {
            ...result._doc,
            _id: result.id,
            createdAt: dateToString(result._doc.createdAt),
            updatedAt: dateToString(result._doc.updatedAt),
          };
        });
      } catch (err) {
        throw err;
      }
    }
  },

  newAppoinment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctoreId = findStaff.doctor;
      }
      const historys = await Appoinment.find({
        doctor: doctorId,
        appoinmentstatus: "Pendding",
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: singledoctor.bind(this, history.doctor),
          user: singleuser.bind(this, history.user),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  appoinmentAccept: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }
    try {
      const data = {};
      if (req.userType === "STAFF") {
        data.staff = req.userId;
        data.appoinmentstatus = args.status;
        data.acceptedby = req.userType;
      } else {
        data.appoinmentstatus = args.status;
        data.acceptedby = req.userType;
      }

      console.log(data);
      await Appoinment.findByIdAndUpdate({ _id: args.appoinmentId }, data, {
        omitUndefined: true,
        new: true,
      });
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong , Please try again later!");
    }
  },
  doctorAppoinment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctoreId = findStaff.doctor;
      }
      const historys = await Appoinment.find({
        doctor: doctorId,
        appoinmentstatus: "Accept",
        status: "Pendding",
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: singledoctor.bind(this, history.doctor),
          user: singleuser.bind(this, history.user),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  appoinmentVisit: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }
    try {
      await Appoinment.findByIdAndUpdate(
        { _id: args.appoinmentId },
        { status: args.status },
        {
          omitUndefined: true,
          new: true,
        }
      );
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong , Please try again later!");
    }
  },
  appoinmentHistory: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctoreId = findStaff.doctor;
      }
      const historys = await Appoinment.find({
        doctor: doctorId,
        $or: [
          {
            $and: [
              { appoinmentstatus: "Accept" },
              { status: { $ne: "Pendding" } },
            ],
          },
          { appoinmentstatus: "Reject" },
        ],
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: singledoctor.bind(this, history.doctor),
          user: singleuser.bind(this, history.user),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  covidAppoinmentAccept: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }
    try {
      const data = {};
      if (req.userType === "STAFF") {
        data.staff = req.userId;
        data.appoinmentstatus = args.status;
        data.acceptedby = req.userType;
      } else {
        data.appoinmentstatus = args.status;
        data.acceptedby = req.userType;
      }
      await CovidAppoinment.findByIdAndUpdate(
        { _id: args.appoinmentId },
        { data },
        {
          omitUndefined: true,
          new: true,
        }
      );
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong , Please try again later!");
    }
  },
  doctorCovidAppoinment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctoreId = findStaff.doctor;
      }
      const historys = await CovidAppoinment.find({
        doctor: doctorId,
        status: "Accept",
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: singledoctor.bind(this, history.doctor),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  coviAppoinmentVisit: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }
    try {
      await CovidAppoinment.findByIdAndUpdate(
        { _id: args.appoinmentId },
        { status: args.status },
        {
          omitUndefined: true,
          new: true,
        }
      );
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong , Please try again later!");
    }
  },
  covidAppoinmentHistory: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctoreId = findStaff.doctor;
      }
      const historys = await Appoinment.find({
        doctor: doctorId,
        $or: [
          {
            $and: [
              { appoinmentstatus: "Accept" },
              { status: { $ne: "Pendding" } },
            ],
          },
          { $or: { appoinmentstatus: "Reject" } },
        ],
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: singledoctordoctor.bind(this, history.doctor),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  review: async (args, req) => {
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
        const review = await Review.find({ doctor: doctorId });
        return review.map((onereview) => {
          if (onereview._doc.appoinmentType === "COVID") {
            return {
              ...onereview._doc,
              _id: onereview.id,
              doctor: singledoctor.bind(this, onereview.doctor),
              user: singleuser.bind(this, onereview.user),
              covidappoinment: singlecovidappoinment.bind(
                this,
                onereview.covidappoinment
              ),
            };
          } else {
            return {
              ...onereview._doc,
              _id: onereview.id,
              doctor: singledoctor.bind(this, onereview.doctor),
              user: singleuser.bind(this, onereview.user),
              appoinment: singleappoinment.bind(this, onereview.appoinment),
            };
          }
        });
      } catch (err) {
        console.log(err);
      }
    }

    if (req.userType === "USER") {
      try {
        const review = await Review.find({ user: req.userId });
        return review.map((onereview) => {
          if (onereview._doc.appoinmentType === "COVID") {
            return {
              ...onereview._doc,
              _id: onereview.id,
              doctor: singledoctor.bind(this, onereview.doctor),
              covidappoinment: singlecovidappoinment.bind(
                this,
                onereview.covidappoinment
              ),
            };
          } else {
            return {
              ...onereview._doc,
              _id: onereview.id,
              doctor: singledoctor.bind(this, onereview.doctor),
              appoinment: singleappoinment.bind(this, onereview.appoinment),
            };
          }
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
  },

  feedback: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType === "STAFF") {
      try {
        const feedback = new Feedback({
          staff: req.userId,
          givenBy: req.userType,
          feedbackText: args.feedback,
          rating: args.rating,
        });
        await feedback.save();
        return true;
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
    if (req.userType === "DOCTOR") {
      try {
        const feedback = new Feedback({
          doctor: req.userId,
          givenBy: req.userType,
          feedbackText: args.feedback,
          rating: args.rating,
        });
        await feedback.save();
        return true;
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
    if (req.userType === "USER") {
      try {
        const feedback = new Feedback({
          user: req.userId,
          givenBy: req.userType,
          feedbackText: args.feedback,
          rating: args.rating,
        });
        await feedback.save();
        return true;
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
  },

  helpAndSupport: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType === "DOCTOR" || req.userType === "STAFF") {
      try {
        const helps = await HelpSupport.find({ user: "DOCTOR" });
        return helps.map((help) => {
          return {
            ...help._doc,
            _id: help.id,
          };
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }

    if (req.userType === "USER") {
      try {
        const helps = await HelpSupport.find({ user: "USER" });
        return helps.map((help) => {
          return {
            ...help._doc,
            _id: help.id,
          };
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }

    if (req.userType === "ADMIN") {
      try {
        const helps = await HelpSupport.find();
        return helps.map((help) => {
          return {
            ...help._doc,
            _id: help.id,
          };
        });
      } catch (err) {
        throw new Error("Something went wrong , Please try again later!");
      }
    }
  },
};
