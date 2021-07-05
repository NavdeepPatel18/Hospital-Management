const Hospital = require("../../models/hospital");
const HospitalPhoto = require("../../models/hospitalphoto");
const Facilities = require("../../models/facilities");
const { processRequest } = require("graphql-upload");
const path = require("path");
const fs = require("fs");

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = {
  uploadImage: async ({ file }) => {
    console.log(file.file);
    const { createReadStream, filename } = await file.file;
    console.log("\nPrint data", createReadStream, "\n\n", filename);

    const { ext } = path.parse(filename);

    const randomName = makeid(12) + ext;

    const stream = createReadStream();
    const pathName = path.join(__dirname, `/public/images/${randomName}`);

    await stream.pipe(fs.createWriteStream(pathName));

    return {
      url: `http://localhost:3000/images/${randomName}`,
    };
  },
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
  hospitalDetail: async (args, req) => {
    try {
      const hospital = await Hospital.findOne({ doctor: args.userId });
      return {
        ...hospital._doc,
        _id: hospital.id,
      };
    } catch (err) {
      console.log(err);
    }
  },
};
