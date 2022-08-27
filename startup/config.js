const config = require("config");

//logging errors if env. var are not set.

module.exports = () => {
  // To set the environment
  console.log("Environment =>", process.env.NODE_ENV);

  if (!process.env.NODE_ENV) {
    throw new Error("FATAL ERROR: environment is not defined..");
  }
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: Secret key is not defined..");
  }
  if (!config.get("cloudinary.cloudName")) {
    throw new Error("FATAL ERROR: cloudName is not defined.");
  }
  if (!config.get("cloudinary.apiKey")) {
    throw new Error("FATAL ERROR: apiKey is not defined.");
  }
  if (!config.get("cloudinary.apiSecret")) {
    throw new Error("FATAL ERROR: apiSecret is not defined.");
  }
};
