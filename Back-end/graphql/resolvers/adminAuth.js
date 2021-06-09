const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../../models/admin");
const Category = require("../../models/category");

module.exports = {
  adminlogin: async ({ username, password }) => {
    console.log(username);
    console.log(password);
    const admin = await Admin.findOne({ name: username });
    if (!admin) {
      throw new Error("User not exist!");
    }

    const isEqual = await bcrypt.compare(password, admin.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    const token = jwt.sign({ userId: admin.id }, "superkey", {
      expiresIn: "1h",
    });

    return {
      userId: admin.id,
      token: token,
      tokenExpirtion: 1,
    };
  },
  createCategory: async (args,req) => {
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
};
