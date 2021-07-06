const bcrypt = require("bcryptjs");
const Doctor = require("../../models/doctor");
const Staff = require("../../models/staff");
const User = require("../../models/user");
const Admin = require("../../models/admin");

module.exports = {
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
};
