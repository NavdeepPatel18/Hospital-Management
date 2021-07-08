const Review = require("../../models/review");
const Doctor = require("../../models/doctor");

module.exports = {
  createReview: async (args, req) => {
    if (!req.isAuth && req.userType === "USER") {
      return res.json({ status: "error", error: "You not have access" });
    }
    try {
      const doctorId = await Doctor.findOne({
        _id: args.reviewInput.doctor,
      });

      if (!doctorId) {
        throw new Error("Doctor not exisist.");
      }

      const review = new Review({
        user: "60c05ddf8b25c745a052a37f",
        doctor: args.reviewInput.doctor,
        text: args.reviewInput.text,
        rating: args.reviewInput.rating,
      });

      const result = await review.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // ViewReview: async (args, req) => {
  //   if (!req.isAuth && req.userType === "USER") {
  //     return res.json({ status: "error", error: "You not have access" });
  //   }
  // },
};
