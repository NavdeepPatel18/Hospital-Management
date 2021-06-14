const Advertisment = require("../../models/advertisment");
const AdvertismentPhoto = require("../../models/advertismentphoto");

module.exports = {
  createAdvertisment: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType === "User") {
      throw new Error("You do not have permission!");
    }
    try {
      const advertismentId = await Advertisment.findOne({
        doctor: args.advertismentInput.doctor,
      });

      if (advertismentId) {
        throw new Error("Advertisment exisist already.");
      }

      const advertisment = new Advertisment({
        doctor: args.advertismentInput.doctor,
        startDate: args.advertismentInput.startDate,
        endDate: args.advertismentInput.endDate,
        title: args.advertismentInput.title,
        detail: args.advertismentInput.detail,
      });

      const result = await advertisment.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createAdvertismentPhoto: async (args, req) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType === "User" || req.userType === "Staff") {
      throw new Error("You do not have permission!");
    }
    try {
      const advertismentPhotoId = await AdvertismentPhoto.countDocuments({
        advertisment: args.advertismentPhotoInput.advertisment,
      });

      if (advertismentPhotoId >= 8) {
        throw new Error("Advertisment reach photo limit.");
      }

      const advertismentPhoto = new AdvertismentPhoto({
        advertisment: args.advertismentPhotoInput.advertisment,
        photo: args.advertismentPhotoInput.photo,
      });

      const result = await advertismentPhoto.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
