const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
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
  doctorProfile: async (args, req) => {
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
  createDoctor: async (args) => {
    try {
      const doctorID = await Doctor.findOne({ email: args.doctorInput.email });

      if (doctorID) {
        throw new Error("Doctor exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.doctorInput.password, 12);

      const doctor = new Doctor({
        name: args.doctorInput.name,
        // education: args.doctorInput.education,
        // experience: args.doctorInput.experience,
        city: args.doctorInput.city,
        email: args.doctorInput.email,
        phone: args.doctorInput.phone,
        password: hashedPassword,
        category: "60bf5090666fb420d479b253",
      });
      const result = await doctor.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updatedoctor: async (args) => {
    try {
      const doctorID = await Doctor.findOne({ email: args.doctorInput.email });

      if (doctorID) {
        throw new Error("Doctor exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.doctorInput.password, 12);

      const doctor = new Doctor({
        name: args.doctorInput.name,
        education: args.doctorInput.education,
        experience: args.doctorInput.experience,
        city: args.doctorInput.city,
        email: args.doctorInput.email,
        phone: args.doctorInput.phone,
        password: hashedPassword,
        category: "60bf5090666fb420d479b253",
      });
      const result = await doctor.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  doctorlogin: async ({ username, password }) => {
    console.log(username);
    console.log(password);
    const doctor = await Doctor.findOne({ email: username });
    if (!doctor) {
      throw new Error("Doctor not exist!");
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
  },
  changedoctorPassword: async (args, req) => {
    try {
      const doctorID = await Doctor.findById({ _id: req.userId });

      if (!doctorID) {
        throw new Error("Doctor not exists .");
      }

      const isEqual = await bcrypt.compare(args.oldpassword, doctorID.password);
      if (!isEqual) {
        throw new Error("currunt password is not correct");
      }

      if (args.oldpassword === args.newpassword) {
        throw new Error("Enter password is same as old password");
      }

      const hashedPassword = await bcrypt.hash(args.newpassword, 12);

      const result = await Doctor.findOneAndUpdate(
        { _id: req.userId },
        { password: hashedPassword }
      );

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  createStaff: async (args) => {
    try {
      const staffID = await Staff.findOne({ email: args.staffInput.email });

      if (staffID) {
        throw new Error("Staff exists already.");
      }
      let createdpassword = Math.random().toString(36).slice(2);
      const hashedPassword = await bcrypt.hash(createdpassword, 12);

      const staff = new Staff({
        name: args.staffInput.name,
        email: args.staffInput.email,
        phone: args.staffInput.phone,
        designation: args.staffInput.designation,
        password: hashedPassword,
        doctor: "60c037c382f1522eb0315f48",
      });
      const result = await staff.save();

      return { ...result._doc, password: createdpassword, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updateStaff: async (args) => {
    try {
      const staffID = await Staff.findOne({ name: args.staffInput.name });

      if (staffID) {
        throw new Error("Staff exists already.");
      }
      let createdpassword = Math.random().toString(36).slice(2);
      const hashedPassword = await bcrypt.hash(createdpassword, 12);

      const staff = new Staff({
        name: args.staffInput.name,
        designation: args.staffInput.designation,
        password: hashedPassword,
        doctor: "60c037c382f1522eb0315f48",
      });
      const result = await staff.save();

      return { ...result._doc, password: createdpassword, _id: result.id };
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
    console.log(
      "\n isAuth value \t" + req.isAuth + "\n usertype \t" + req.userType
    );
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType === "Admin") {
      throw new Error("You do not have permission!");
    }
    try {
      const staffs = await Staff.find({ doctor: args.doctor });
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
