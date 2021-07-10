const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Appoinment = require("../../models/appoinment");
const User = require("../../models/user");

async function tokengenerator() {
  var token = [];
  for (let i = 0; i < 10; i++) {
    token.push(i);
  }
  var m = token.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = token[m];
    token[m] = token[i];
    token[i] = t;
  }

  console.log(token.join(""), typeof token.join(""));
  const tokenNumber = await parseInt(token.join(""), 10);
  console.log(typeof tokenNumber, tokenNumber);
  return tokenNumber;
}

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
      { userId: user.id, useremail: user._doc.email, userType: "USER" },
      "superkey",
      {
        expiresIn: "1d",
      }
    );

    return {
      userId: user.id,
      token: token,
      userType: "USER",
    };
  },
  userProfile: async (req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }
    if (req.userType !== "USER") {
      throw new Error({ status: "error", error: "You not have access" });
    }

    try {
      const user = await User.findById({ _id: req.userId });
      return {
        ...user._doc,
        _id: user.id,
      };
    } catch (err) {
      console.log(err);
    }
  },
  createAppoinment: async (args, req) => {
    if (!req.isAuth && req.userType !== "USER") {
      throw new Error("You not have access");
    }
    const find = await User.findById({ _id: req.userId });
    if (!find) {
      throw new Error("Please try again");
    }
    try {
      const token = await tokengenerator();
      const appoinment = new Appoinment({
        doctor: args.appoinmentInput.doctor,
        user: find.id,
        token: token,
        problem: args.appoinmentInput.problem,
        bp: args.appoinmentInput.bp,
        caseType: args.appoinmentInput.caseType,
        suger: args.appoinmentInput.suger,
        allergy: args.appoinmentInput.allergy,
        history: args.appoinmentInput.history,
        date: new Date(args.appoinmentInput.date).toISOString(),
        slot: args.appoinmentInput.slot,
      });
      await appoinment.save();
      return true;
    } catch (err) {
      console.log(err);
      throw new Error("Something went wrong , Please try again later!");
    }
  },
  cancleAppoinment: async (args, req) => {
    if (!req.isAuth && req.userType !== "USER") {
      throw new Error("You not have access");
    }
    try {
      await Appoinment.findByIdAndUpdate(
        { _id: args.appoinmentId },
        { userstatus: args.status },
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
  myAppoinment: async (args, req) => {
    if (!req.isAuth && req.userType !== "USER") {
      throw new Error("You not have access");
    }
    try {
      const appoinments = await Appoinment.find({
        user: req.userId,
      });
      return appoinments.map((appoinment) => {
        return {
          ...appoinment._doc,
          _id: appoinment.id,
        };
      });
    } catch (err) {
      throw new Error("Something went wrong , Please try again later!");
    }
  },
};
