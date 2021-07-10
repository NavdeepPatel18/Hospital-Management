const doctorauthResolvers = require("./doctorAuth");
const doctor_staffResolvers = require("./doctor_staff");
const changePasswordResolvers = require("./changePassword");
const userauthResolvers = require("./userAuth");
const adminauthResolvers = require("./adminAuth");
const hospitalResolvers = require("./hospital");
const reviewResolvers = require("./review");
const advertismentResolvers = require("./advertisment");
const covidResolvers = require("./covid");
const { GraphQLUpload } = require("graphql-upload");

const rootResolvers = {
  Upload: GraphQLUpload,
  ...doctorauthResolvers,
  ...doctor_staffResolvers,
  ...changePasswordResolvers,
  ...adminauthResolvers,
  ...hospitalResolvers,
  ...userauthResolvers,
  ...reviewResolvers,
  ...advertismentResolvers,
  ...covidResolvers,
};

module.exports = rootResolvers;
