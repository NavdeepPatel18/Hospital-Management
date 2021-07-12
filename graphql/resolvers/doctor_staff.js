const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../../models/doctor");
const Hospital = require("../../models/hospital");
const HospitalPhoto = require("../../models/hospitalphoto");
const Facilities = require("../../models/facilities");
const CovidCenter = require("../../models/covidcenter");
const Staff = require("../../models/staff");
const User = require("../../models/user");
const Admin = require("../../models/admin");
const Attendence = require("../../models/attendence");
const CovidAppoinment = require("../../models/covidappoinment");

const doctor = require("./merge");

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

  attendence: async (args) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        await Doctor.findByIdAndUpdate(
          { _id: req.userId },
          {
            inoutstatus: args.status,
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
            inoutstatus: args.status,
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
      await Appoinment.findByIdAndUpdate(
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
        status: "Accept",
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: doctor.bind(this, history.doctor),
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
          { $or: { appoinmentstatus: "Reject" } },
        ],
      });
      return historys.map((history) => {
        return {
          ...history._doc,
          _id: history.id,
          doctor: doctor.bind(this, history.doctor),
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
          doctor: doctor.bind(this, history.doctor),
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
          doctor: doctor.bind(this, history.doctor),
          createdAt: dateToString(history._doc.createdAt),
          updatedAt: dateToString(history._doc.updatedAt),
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
};
