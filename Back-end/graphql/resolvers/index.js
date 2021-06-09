const doctorauthResolvers = require("./doctorAuth");
const userauthResolvers = require("./userAuth");
const adminauthResolvers = require("./adminAuth");
const hospitalResolvers = require("./hospital");

const rootResolvers = {
  ...doctorauthResolvers,
  ...adminauthResolvers,
  ...hospitalResolvers,
  ...userauthResolvers,
};

module.exports = rootResolvers;
