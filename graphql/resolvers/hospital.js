const Hospital = require("../../models/hospital");
const HospitalPhoto = require("../../models/hospitalphoto");
const Facilities = require("../../models/facilities");

module.exports = {
  createHospital: async (args) => {
    try {
      const doctoreId = await Hospital.findOne({
        doctor: args.hospitalInput.doctor,
      });

      if (doctoreId) {
        throw new Error("Hospital exisist already.");
      }

      const hospital = new Hospital({
        name: args.hospitalInput.name,
        doctor: args.hospitalInput.doctor,
        city: args.hospitalInput.city,
        email: args.hospitalInput.email,
        number1: args.hospitalInput.number1,
        number2: args.hospitalInput.number2,
        address: args.hospitalInput.address,
        location: args.hospitalInput.location,
      });

      const result = await hospital.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createHospitalPhoto: async (args) => {
    try {
      const hospital = await HospitalPhoto.countDocuments({
        hospital: args.hospitalPhotoInput.hospital,
      });

      if (hospital >= 8) {
        throw new Error("hospital reach photo limit.");
      }

      const hospitalphoto = new HospitalPhoto({
        name: args.hospitalPhotoInput.name,
        photo: args.hospitalPhotoInput.photo,
        hospital: args.hospitalPhotoInput.hospital,
      });

      const result = await hospitalphoto.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createFacilities: async (args) => {
    try {
      const facilitiesId = await Facilities.findOne({
        hospital: args.facilitiesInput.hospital,
      });

      if (facilitiesId) {
        throw new Error("This hospital facilities exisist already.");
      }

      const facilities = new Facilities({
        name: args.facilitiesInput.name,
        hospital: args.facilitiesInput.hospital,
      });

      const result = await facilities.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
