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
  staffProfile: async (args, req) => {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You not have access" });
    }

    try {
      const staff = await Staff.findOne({
        $or: [{ _id: args.staffId }, { doctor: req.userId }],
      });
      return {
        ...staff._doc,
        _id: staff.id,
      };
    } catch (err) {
      console.log(err);
    }
  },
};
