const Review = require("../../models/review");
const Doctor = require("../../models/doctor");
const Appoinment = require("../../models/appoinment");
const CovidAppoinment = require("../../models/covidappoinment");

const {
  singledoctor,
  singleuser,
  singlecovidappoinment,
  singleappoinment,
} = require("./merge");

module.exports = {
  createReview: async (args, req) => {
    if (!req.isAuth && req.userType === "USER") {
      throw new Error({ status: "error", error: "You not have access" });
    }
    try {
      const doctorId = await Doctor.findOne({
        _id: args.reviewInput.doctor,
      });

      if (!doctorId) {
        throw new Error("Doctor not exisist.");
      }

      const appoinment = await Appoinment.findById({
        _id: args.reviewInput.appoinment,
      });
      const covidappoinment = await CovidAppoinment.findById({
        _id: args.reviewInput.appoinment,
      });

      var data = {
        user: req.userId,
        doctor: args.reviewInput.doctor,
        text: args.reviewInput.text,
        rating: args.reviewInput.rating,
      };

      if (appoinment) {
        data.appoinment = args.reviewInput.appoinment;
        data.appoinmentType = "REGULAR";
      } else if (covidappoinment) {
        data.covidappoinment = args.reviewInput.appoinment;
        data.appoinmentType = "COVID";
      } else {
        throw new Error("Something went wrong");
      }

      const review = new Review(data);

      const onereview = await review.save();

      if (onereview._doc.appoinmentType === "COVID") {
        return {
          ...onereview._doc,
          _id: onereview.id,
          doctor: singledoctor.bind(this, onereview.doctor),
          user: singleuser.bind(this, onereview.user),
          covidappoinment: singlecovidappoinment.bind(
            this,
            onereview.covidappoinment
          ),
        };
      } else {
        return {
          ...onereview._doc,
          _id: onereview.id,
          doctor: singledoctor.bind(this, onereview.doctor),
          user: singleuser.bind(this, onereview.user),
          appoinment: singleappoinment.bind(this, onereview.appoinment),
        };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
