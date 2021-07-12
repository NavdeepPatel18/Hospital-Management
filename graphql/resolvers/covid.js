const Hospital = require("../../models/hospital");
const CovidCenter = require("../../models/covidcenter");

const { hospital } = require("./merge");

module.exports = {
  updateCovidCenter: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        const findhospital = await Hospital.findOneAndUpdate(
          { doctor: req.userId },
          { covidCenter: "Yes" }
        );
        const result = await CovidCenter.findOneAndUpdate(
          { hospital: findhospital.id },
          {
            totalbed: args.updateCovidCenterInput.totalbed,
            oxygen: args.updateCovidCenterInput.oxygen,
            ventilator: args.updateCovidCenterInput.ventilator,
            vacantbed: args.updateCovidCenterInput.vacantbed,
            icubed: args.updateCovidCenterInput.icubed,
          },
          {
            omitUndefined: true,
            new: true,
          }
        );

        return {
          ...result._doc,
          _id: result.id,
          hospital: hospital.bind(this, result._doc.hospital),
        };
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const doctor = await staff.findById({ _id: req.userId });
        const hospital = await Hospital.findOneAndUpdate(
          { doctor: doctor.doctor },
          { covidCenter: "Yes" }
        );
        const result = await CovidCenter.findOneAndUpdate(
          { hospital: hospital.id },
          {
            totalbed: args.updateCovidCenterInput.totalbed,
            oxygen: args.updateCovidCenterInput.oxygen,
            ventilator: args.updateCovidCenterInput.ventilator,
            vacantbed: args.updateCovidCenterInput.vacantbed,
            icubed: args.updateCovidCenterInput.icubed,
          },
          {
            omitUndefined: true,
            new: true,
          }
        );

        return {
          ...result._doc,
          _id: result.id,
          hospital: hospital.bind(this, result._doc.hospital),
        };
      } catch (err) {
        throw err;
      }
    }
  },

  updateCovidStatus: async (args, req) => {
    if (!req.isAuth) {
      throw new Error({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" && req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        await Hospital.findOneAndUpdate(
          { doctor: req.userId },
          { covidCenter: args.status }
        );

        return true;
      } catch (err) {
        throw err;
      }
    } else {
      try {
        const doctor = await staff.findById({ _id: req.userId });
        await Hospital.findOneAndUpdate(
          { doctor: doctor.doctor },
          { covidCenter: args.status }
        );

        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  covidDetail: async (args, req) => {
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
      const findhospital = await Hospital.findOne({ doctor: doctorId });

      const covidcenter = await CovidCenter.findOne({
        hospital: findhospital.id,
      });
      return {
        ...covidcenter._doc,
        _id: covidcenter.id,
        hospital: hospital.bind(this, covidcenter._doc.hospital),
      };
    } catch (err) {
      console.log(err);
    }
  },
};
