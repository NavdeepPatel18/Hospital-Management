const doctorauthResolvers = require("./doctorAuth");
const userauthResolvers = require("./userAuth");
const adminauthResolvers = require("./adminAuth");
const hospitalResolvers = require("./hospital");
const appoinmentResolvers = require("./appoinment");
const reviewResolvers = require("./review");
const advertismentResolvers = require("./advertisment");
const covidResolvers = require("./covid");

const rootResolvers = {
  ...doctorauthResolvers,
  ...adminauthResolvers,
  ...hospitalResolvers,
  ...userauthResolvers,
  ...appoinmentResolvers,
  ...reviewResolvers,
  ...advertismentResolvers,
  ...covidResolvers,
};

module.exports = rootResolvers;
