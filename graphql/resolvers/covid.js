const Hospital = require("../../models/hospital");
const CovidCenter = require("../../models/covidcenter");
const CovidBooking = require("../../models/covidbooking");

module.exports = {
  updateCovidCenter: async (args, req) => {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" || req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (args.updatecovidcenter !== "Yes") {
      throw new Error("Please start covid Center!");
    }

    if (req.userType === "DOCTOR") {
      try {
        const hospital = await Hospital.findOneAndUpdate(
          { doctor: req.userId },
          { status: "Yes" }
        );
        const result = await CovidCenter.findOneAndUpdate(
          { hospital: hospital.id },
          {
            totalbed: args.updateCovidCenter.totalbed,
            oxygen: args.updateCovidCenterte.oxygen,
            ventilator: args.hospitalUpdate.updateCovidCenterentilator,
            vacantbed: args.updateCovidCentervacantbed,
            icubed: args.updateCovidCenterte.icubed,
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
        const doctor = await staff.findById({ _id: req.userId });
        const hospital = await Hospital.findOneAndUpdate(
          { doctor: doctor.doctor },
          { status: "Yes" }
        );
        const result = await CovidCenter.findOneAndUpdate(
          { hospital: hospital.id },
          {
            totalbed: args.updateCovidCenter.totalbed,
            oxygen: args.updateCovidCenterte.oxygen,
            ventilator: args.hospitalUpdate.updateCovidCenterentilator,
            vacantbed: args.updateCovidCentervacantbed,
            icubed: args.updateCovidCenterte.icubed,
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

  updateCovidStatus: async (args, req) => {
    if (!req.isAuth) {
      return res.json({ status: "error", error: "You not have access" });
    }

    if (req.userType !== "DOCTOR" || req.userType !== "STAFF") {
      throw new Error("You do not have permission!");
    }

    if (req.userType === "DOCTOR") {
      try {
        await Hospital.findOneAndUpdate(
          { doctor: req.userId },
          { status: args.status }
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
          { status: args.status }
        );

        return true;
      } catch (err) {
        throw err;
      }
    }
  },

  createCovidBooking: async (args) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "USER") {
      throw new Error("You do not have permission!");
    }
    try {
      // const covidBookingId = await CovidBooking.findOne({
      //   hospital: args.covidCenterInput.hospital,
      // });

      // if (covidBookingId) {
      //   throw new Error("CovidBooking already ! Done.");
      // }

      const covidBooking = new CovidBooking({
        center: args.covidBookingInput.center,
        bedno: args.covidBookingInput.bedno,
        oxygen: args.covidBookingInput.oxygen,
        ventilator: args.covidBookingInput.ventilator,
        dateIn: args.covidBookingInput.dateIn,
        dateOut: args.covidBookingInput.dateOut,
      });

      const result = await covidBooking.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
