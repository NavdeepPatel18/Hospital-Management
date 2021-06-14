const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  createUser: async (args) => {
    try {
      const userID = await User.findOne({ email: args.userInput.email });

      if (userID) {
        throw new Error("User exists already.");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        name: args.userInput.name,
        city: args.userInput.city,
        address: args.userInput.address,
        email: args.userInput.email,
        password: hashedPassword,
        age: args.userInput.age,
        gender: args.userInput.gender,
        phone: args.userInput.phone,
      });
      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  userlogin: async ({ username, password }) => {
    console.log(username);
    console.log(password);
    const user = await User.findOne({ email: username });
    if (!user) {
      throw new Error("User not exist!");
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error("Password is incorrect!");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "superkey",
      {
        expiresIn: "1h",
      }
    );

    return {
      userId: user.id,
      token: token,
      tokenExpirtion: 1,
    };
  },
};