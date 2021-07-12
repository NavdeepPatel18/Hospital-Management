const Hospital = require("../../models/hospital");
const HospitalPhoto = require("../../models/hospitalphoto");
const Facilities = require("../../models/facilities");
const Staff = require("../../models/staff");
const Doctor = require("../../models/doctor");

const { doctor } = require("./merge");

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

  hospitalDetail: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }
    try {
      var doctorId = req.userId;
      if (req.userType === "STAFF") {
        const findStaff = await Staff.findOne({ _id: req.userId });
        doctorId = findStaff.doctor;
      }
      const hospital = await Hospital.findOne({ doctor: doctorId });
      return {
        ...hospital._doc,
        _id: hospital.id,
        doctor: doctor.bind(this, hospital.doctor),
      };
    } catch (err) {
      console.log(err);
    }
  },

  updateHospital: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        const result = await Hospital.findOneAndUpdate(
          { doctor: req.userId },
          {
            name: args.updateHospital.name,
            email: args.updateHospital.email,
            number: args.updateHospital.number,
            address: args.updateHospital.address,
            location: args.updateHospital.location,
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
    } else {
      try {
        const doctor = await Staff.findById({ _id: req.userId });
        const result = await Hospital.findOneAndUpdate(
          { doctor: doctor.doctor },
          {
            name: args.updateHospital.name,
            email: args.updateHospital.email,
            number: args.updateHospital.number,
            address: args.updateHospital.address,
            location: args.updateHospital.location,
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
    }
  },
};
