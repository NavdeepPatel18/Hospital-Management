const CovidCenter = require("../../models/covidcenter");
const CovidBooking = require("../../models/covidbooking");

module.exports = {
  createCovidCenter: async (args) => {
    try {
      const covidCenterId = await CovidCenter.findOne({
        hospital: args.covidCenterInput.hospital,
      });

      if (covidCenterId) {
        throw new Error("CovidCenter exisist already.");
      }

      const covidCenter = new CovidCenter({
        hospital: args.covidCenterInput.hospital,
        totalbed: args.covidCenterInput.totalbed,
        oxygen: args.covidCenterInput.oxygen,
        ventilator: args.covidCenterInput.ventilator,
      });

      const result = await covidCenter.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createCovidBooking: async (args) => {
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
