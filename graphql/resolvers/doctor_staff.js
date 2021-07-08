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
    if (
      !req.isAuth &&
      (req.userType === "STAFF" || req.userType === "DOCTOR")
    ) {
      return res.json({ status: "error", error: "You not have access" });
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
    if (
      !req.isAuth &&
      (req.userType === "STAFF" || req.userType === "DOCTOR")
    ) {
      return res.json({ status: "error", error: "You not have access" });
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
};
