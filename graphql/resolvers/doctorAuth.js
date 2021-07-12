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
const Avability = require("../../models/avability");
const { dateToString } = require("../../helpers/date");

const { category } = require("./merge");

module.exports = {
  doctor: async (args, req) => {
    try {
      const doctorID = await Doctor.findOne({ email: args.doctorInput.email });
      const doctors = await Doctor.find();
      return doctors.map((doctor) => {
        return {
          ...doctor._doc,
          _id: doctor.id,
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  staffs: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "DOCTOR") {
      throw new Error("You do not have permission!");
    }
    try {
      const staffs = await Staff.find({
        doctor: req.userId,
        status: "Working",
      });
      return staffs.map((staff) => {
        return {
          ...staff._doc,
          _id: staff.id,
        };
      });
    } catch (err) {
      console.log(err);
    }
  },
  doctorProfile: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "DOCTOR") {
      throw new Error("You do not have permission!");
    }

    try {
      const doctor = await Doctor.findById({ _id: req.userId });
      return {
        ...doctor._doc,
        _id: doctor.id,
        category: category.bind(this, doctor._doc.category),
      };
    } catch (err) {
      console.log(err);
    }
  },
  staffProfile: async (args, req) => {
    if (
      !req.isAuth &&
      (req.userType === "STAFF" || req.userType === "DOCTOR")
    ) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const staff = await Staff.findOne({
        $or: [{ _id: args.staffId }, { _id: req.userId }],
      });
      return {
        ...staff._doc,
        _id: staff.id,
      };
    } catch (err) {
      console.log(err);
    }
  },

  createDoctor: async (args) => {
    try {
      const doctorID = await Doctor.findOne({ email: args.doctorInput.email });

      if (doctorID) {
        throw new Error("Doctor exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.doctorInput.password, 12);
      const dumyData = "Not Provided";

      const doctor = new Doctor({
        name: args.doctorInput.name,
        education: dumyData,
        experience: 0,
        city: args.doctorInput.city,
        email: args.doctorInput.email,
        phone: args.doctorInput.phone,
        password: hashedPassword,
        category: args.doctorInput.category,
        status: "pendding",
        createdAt: new Date().toISOString,
        updatedAt: new Date().toISOString,
      });

      const doctorResult = await doctor.save();
      if (doctorResult) {
        const hospital = new Hospital({
          name: dumyData,
          doctor: doctorResult.id,
          email: dumyData,
          number: dumyData,
          address: dumyData,
          location: dumyData,
          covidCenter: "No",
        });
        const hospitalResult = await hospital.save();
        if (hospitalResult) {
          const hospitalphoto = new HospitalPhoto({
            name: dumyData,
            photo: 0,
            hospital: hospitalResult.id,
          });

          await hospitalphoto.save();

          const facilities = new Facilities({
            name: dumyData,
            hospital: hospitalResult.id,
          });

          await facilities.save();

          const covidCenter = new CovidCenter({
            hospital: hospitalResult.id,
            totalbed: 0,
            oxygen: 0,
            ventilator: 0,
            vacantbed: 0,
            icubed: 0,
          });

          await covidCenter.save();
        }

        const dayList = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];

        const avability = [];
        dayList.map((dayName) => {
          avability.push({
            doctor: doctorResult.id,
            slot: [dumyData],
            day: dayName,
          });
        });
        await Avability.insertMany(avability);
      }

      return {
        ...doctorResult._doc,
        password: null,
        _id: doctorResult.id,
        createdAt: dateToString(doctorResult._doc.createdAt),
        updatedAt: dateToString(doctorResult._doc.updatedAt),
      };
    } catch (err) {
      throw err;
    }
  },
  updatedoctor: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const result = await Doctor.findByIdAndUpdate(
        { _id: req.userId },
        {
          name: args.updateDoctorInput.name,
          education: args.updateDoctorInput.education,
          experience: args.updateDoctorInput.experience,
          city: args.updateDoctorInput.city,
          email: args.updateDoctorInput.email,
          phone: args.updateDoctorInput.phone,
          category: args.updateDoctorInput.category,
        },
        {
          omitUndefined: true,
          new: true,
        }
      );

      return {
        ...result._doc,
        password: null,
        _id: result.id,
        category: category.bind(this, doctor._doc.category)
      };
    } catch (err) {
      throw err;
    }
  },
  updateslot: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const find = await Avability.findOne({
        doctor: req.userId,
        day: args.day,
      });
      if (!find) {
        throw new Error("Slot not avalable.");
      }
      const result = await Avability.findByIdAndUpdate(
        { _id: find.id },
        {
          slot: args.slot,
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

  createStaff: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      throw new Error({ status: "error", error: "You not have access" });
    }
    try {
      const staffID = await Staff.findOne({ email: args.staffInput.email });

      if (staffID) {
        throw new Error("Staff already exists .");
      }
      let createdpassword = Math.random().toString(36).slice(2);
      const hashedPassword = await bcrypt.hash(createdpassword, 12);

      const staff = new Staff({
        name: args.staffInput.name,
        email: args.staffInput.email,
        phone: args.staffInput.phone,
        designation: args.staffInput.designation,
        password: hashedPassword,
        status: "Working",
        doctor: req.userId,
      });
      const result = await staff.save();

      return { ...result._doc, password: createdpassword, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  deleteStaff: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const result = await Staff.findByIdAndUpdate(
        { _id: args.staffId },
        {
          status: "deleted",
        },
        {
          omitUndefined: true,
          new: true,
        }
      );

      return true;
    } catch (err) {
      throw err;
    }
  },
};
