const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const Admin = require("../../models/admin");
const Category = require("../../models/category");
const Feedback = require("../../models/feedback");
const HelpSupport = require("../../models/help_support");

module.exports = {
  adminlogin: async ({ username, password }) => {
    const admin = await Admin.findOne({ name: username });
    if (!admin) {
      throw new Error("User not exist!");
    }
    const isEqual = await bcrypt.compare(password, admin.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }
    const token = jwt.sign(
      { userId: admin.id, userType: "ADMIN" },
      "superkey",
      {
        expiresIn: "1d",
      }
    );
    return {
      userId: admin.id,
      token: token,
      userType: "ADMIN",
    };
  },
  adminProfile: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "ADMIN") {
      throw new Error("You do not have permission!");
    }

    try {
      const admin = await Admin.findById({ _id: req.userId });
      return {
        ...admin._doc,
        _id: admin.id,
      };
    } catch (err) {
      console.log(err);
    }
  },
  updateAdmin: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "ADMIN") {
      throw new Error("You do not have permission!");
    }
    try {
      const hashedPassword = await bcrypt.hash(args.password, 12);

      console.log("hello " + typeof args.name + "\t\t " + typeof args.password);

      const data = _.pick(args, _.identity);
      const adminchange = {};

      Object.keys(data).forEach((key) => {
        if (data[key]) {
          adminchange[key] = data[key];
        }
      });

      const result = await Admin.findOneAndUpdate(
        { _id: req.userId },
        { adminchange },
        {
          omitUndefined: false,
          new: true,
          multi: false,
          runValidators: true,
        }
      );

      if (!result) {
        throw new Error("Admin not exists.");
      }

      console.log(args.name + "\t" + args.password);

      // const result = await Admin.updateOne({ _id: req.userId }, adminchange, {
      //   new: false,
      //   // returnOriginal: true,
      // });

      console.log("\n" + result.id + "\n" + result._doc);

      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },

  createCategory: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "ADMIN") {
      throw new Error("You do not have permission!");
    }
    try {
      const categoryId = await Category.findOne({
        name: args.name,
      });
      if (categoryId) {
        throw new Error("Category exisist already.");
      }

      const category = new Category({
        name: args.name,
      });
      const result = await category.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  categorys: async () => {
    try {
      const categorys = await Category.find();
      return categorys.map((category) => {
        return {
          ...category._doc,
          _id: category.id,
        };
      });
    } catch (err) {
      console.log(err);
    }
  },

  createHelp: async (args, req) => {
    if (!req.isAuth && req.userType === "ADMIN") {
      throw new Error({ status: "error", error: "You not have access" });
    }
    try {
      const help = new HelpSupport({
        admin: req.userId,
        user: args.userType,
        question: args.question,
        answer: args.answer,
      });
      const result = await help.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  updateHelp: async (args, req) => {
    if (!req.isAuth && req.userType === "ADMIN") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const result = await HelpSupport.findOneAndUpdate(
        { _id: args.helpId },
        {
          user: args.userType,
          question: args.question,
          answer: args.answer,
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
  deleteHelp: async (args, req) => {
    if (!req.isAuth && req.userType === "ADMIN") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      await HelpSupport.findByIdAndDelete({ _id: args.helpId });

      return true;
    } catch (err) {
      throw err;
    }
  },

  viewFeedback: async (req) => {
    if (!req.isAuth && req.userType === "ADMIN") {
      throw new Error({ status: "error", error: "You not have access" });
    }
    try {
      const helps = await Feedback.find();
      return helps.map((help) => {
        return {
          ...help._doc,
          _id: help.id,
        };
      });
    } catch (err) {
      throw new Error("Something went wrong , Please try again later!");
    }
  },
};
