const mongoose = require("mongoose");
const config = require("config");

module.exports = () => {
  mongoose
    .connect(config.get("db"), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("You are connected to MongoDB");
    })
    .catch((err) => {
      console.error("Something Went Wrong..", err);
    });
};
