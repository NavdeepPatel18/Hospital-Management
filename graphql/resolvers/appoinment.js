const Appoinment = require("../../models/appoinment");

module.exports = {
  createAppoinment: async (args) => {
    if (!req.isAuth) {
      throw new Error("You are not Authenticated!");
    }
    if (req.userType !== "USER") {
      throw new Error("You do not have permission!");
    }
    try {
      //   const appoinmentId = await Appoinment.findOne({
      //     doctor: args.appoinmentInput.doctor,
      //   });

      //   if (appoinmentId) {
      //     throw new Error("Appoinment exisist already.");
      //   }

      const appoinment = new Appoinment({
        user: "60c05ddf8b25c745a052a37f",
        doctor: args.appoinmentInput.doctor,
        problem: args.appoinmentInput.problem,
        bp: args.appoinmentInput.bp,
        caseType: args.appoinmentInput.caseType,
        suger: args.appoinmentInput.suger,
        allergy: args.appoinmentInput.allergy,
        history: args.appoinmentInput.history,
        date: args.appoinmentInput.date,
        time: args.appoinmentInput.time,
        tocken: args.appoinmentInput.tocken,
        conformby: "",
        status: "",
        statusDate: "",
      });

      const result = await appoinment.save();

      return { ...result._doc, _id: result.id };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
};
