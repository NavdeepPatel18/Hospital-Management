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
        category: "60bf5090666fb420d479b253",
        status: "pendding",
      });

      const doctorResult = await doctor.save();

      const hospital = new Hospital({
        name: dumyData,
        doctor: doctorResult.id,
        email: dumyData,
        number: 0,
        address: dumyData,
        location: dumyData,
        covidCenter: "No",
      });
      const hospitalResult = await hospital.save();

      const hospitalphoto = new HospitalPhoto({
        name: dumyData,
        photo: 0,
        hospital: hospitalResult.id,
      });

      const hospitalphotoResult = await hospitalphoto.save();

      const facilities = new Facilities({
        name: dumyData,
        hospital: hospitalResult.id,
      });

      const facilitiesResult = await facilities.save();

      const covidCenter = new CovidCenter({
        hospital: hospitalResult.id,
        totalbed: 0,
        oxygen: 0,
        ventilator: 0,
        vacantbed: 0,
        icubed: 0,
      });

      const covidCenterresult = await covidCenter.save();

      return { ...doctorResult._doc, password: null, _id: doctorResult.id };
    } catch (err) {
      throw err;
    }
  },
  updatedoctor: async (args) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      return res.json({ status: "error", error: "You not have access" });
    }

    try {
      const result = await Doctor.findByIdAndUpdate(
        { _id: req.userId },
        {
          name: args.doctorUpdate.name,
          education: args.doctorUpdate.education,
          experience: args.doctorUpdate.experience,
          city: args.doctorUpdate.city,
          email: args.doctorUpdate.email,
          phone: args.doctorUpdate.phone,
          category: args.doctorUpdate.category,
        },
        {
          omitUndefined: true,
          new: true,
        }
      );

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  doctorlogin: async ({ username, password }) => {
    try {
      const doctor = await Doctor.findOne({ email: username });
      const staff = await Staff.findOne({ email: username });
      if (!staff && !doctor) {
        throw new Error("Email is incorrect!");
      } else if (doctor) {
        if (!doctor.status == "approved") {
          throw new Error("Admin not approved !!! Please contact to Admin!");
        }
        const isEqual = await bcrypt.compare(password, doctor.password);
        if (!isEqual) {
          throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
          { userId: doctor.id, email: doctor.email, userType: "DOCTOR" },
          "superkey"
        );

        return {
          userId: doctor.id,
          token: token,
        };
      } else if (staff) {
        const isEqual = await bcrypt.compare(password, staff.password);
        if (!isEqual) {
          throw new Error("Password is incorrect!");
        }

        const token = jwt.sign(
          { userId: staff.id, email: staff.email, userType: "STAFF" },
          "superkey"
        );

        return {
          userId: staff.id,
          token: token,
        };
      } else {
        throw new Error("Some thing went wrong");
      }
    } catch (err) {
      throw err;
    }
  },
  changePassword: async (args, req) => {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.userType === "DOCTOR") {
      try {
        const doctorID = await Doctor.findById({ _id: req.userId });

        if (!doctorID) {
          throw new Error("Doctor not exists .");
        }

        const isEqual = await bcrypt.compare(
          args.oldpassword,
          doctorID.password
        );
        if (!isEqual) {
          throw new Error("currunt password is not correct");
        }

        if (args.oldpassword === args.newpassword) {
          throw new Error("Enter password is same as old password");
        }

        const hashedPassword = await bcrypt.hash(args.newpassword, 12);

        await Doctor.findOneAndUpdate(
          { _id: req.userId },
          { password: hashedPassword }
        );

        return true;
      } catch (err) {
        throw err;
      }
    } else if (req.userType === "STAFF") {
      try {
        const staffID = await Staff.findById({ _id: req.userId });

        if (!staffID) {
          throw new Error("Staff not exists .");
        }

        const isEqual = await bcrypt.compare(
          args.oldpassword,
          staffID.password
        );
        if (!isEqual) {
          throw new Error("currunt password is not correct");
        }

        if (args.oldpassword === args.newpassword) {
          throw new Error("Enter password is same as old password");
        }

        const hashedPassword = await bcrypt.hash(args.newpassword, 12);

        await Staff.findOneAndUpdate(
          { _id: req.userId },
          { password: hashedPassword }
        );

        return true;
      } catch (err) {
        throw err;
      }
    } else if (req.userType === "ADMIN") {
      try {
        const adminID = await Admin.findById({ _id: req.userId });

        if (!adminID) {
          throw new Error("Admin not exists .");
        }

        const isEqual = await bcrypt.compare(
          args.oldpassword,
          adminID.password
        );
        if (!isEqual) {
          throw new Error("currunt password is not correct");
        }

        if (args.oldpassword === args.newpassword) {
          throw new Error("Enter password is same as old password");
        }

        const hashedPassword = await bcrypt.hash(args.newpassword, 12);

        await Admin.findOneAndUpdate(
          { _id: req.userId },
          { password: hashedPassword }
        );

        return true;
      } catch (err) {
        throw err;
      }
    } else if (req.userType === "USER") {
      try {
        const userID = await User.findById({ _id: req.userId });

        if (!userID) {
          throw new Error("User not exists .");
        }

        const isEqual = await bcrypt.compare(args.oldpassword, userID.password);
        if (!isEqual) {
          throw new Error("currunt password is not correct");
        }

        if (args.oldpassword === args.newpassword) {
          throw new Error("Enter password is same as old password");
        }

        const hashedPassword = await bcrypt.hash(args.newpassword, 12);

        await User.findOneAndUpdate(
          { _id: req.userId },
          { password: hashedPassword }
        );

        return true;
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Some thing went wrong!");
    }
  },
  createStaff: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      return res.json({ status: "error", error: "You not have access" });
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
  updateDoctorStaff: async (args, req) => {
    if (
      !req.isAuth &&
      (req.userType === "STAFF" || req.userType === "DOCTOR")
    ) {
      return res.json({ status: "error", error: "You not have access" });
    }

    try {
      const result = await Staff.findByIdAndUpdate(
        { _id: args.staffId },
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
  deleteStaff: async (args, req) => {
    if (!req.isAuth && req.userType === "DOCTOR") {
      return res.json({ status: "error", error: "You not have access" });
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
  stafflogin: async ({ username, password }) => {
    console.log(username);
    console.log(password);
    const staff = await Staff.findOne({ name: username });
    if (!staff) {
      throw new Error("Staff not exist!");
    }

    const isEqual = await bcrypt.compare(password, staff.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    const token = jwt.sign({ userId: staff.id }, "superkey", {
      expiresIn: "1h",
    });

    return {
      userId: staff.id,
      token: token,
      tokenExpirtion: 1,
    };
  },
  staffs: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (!req.userType === "DOCTOR") {
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
      return res.json({ status: "error", error: "You not have access" });
    }

    try {
      const doctor = await Doctor.findById({ _id: req.userId });
      return {
        ...doctor._doc,
        _id: doctor.id,
      };
    } catch (err) {
      console.log(err);
    }
  },
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
  attendence: async (args) => {
    try {
      // const attendenceID = await Attendence.findOne({ name: args.staffInput.name });

      // if (attendenceID) {
      //   throw new Error("Staff exists already.");
      // }

      const doctorID = await Staff.findOne({
        _id: args.attendenceInput.staff,
      });

      if (!doctorID) {
        throw new Error("You do not have permission.");
      }

      const addattendence = new Attendence({
        staff: args.attendenceInput.staff,
        timeIn: args.attendenceInput.timeIn,
        timeOut: args.attendenceInput.timeOut,
        doctor: doctorID._doc.doctor,
      });
      const result = await addattendence.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
};
