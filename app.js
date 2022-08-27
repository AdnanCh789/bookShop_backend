const express = require("express");
const config = require("config");

const app = express();

require("./startup/config")();
require("./startup/db")();
require("./startup/logging")();
require("./startup/routes")(app);

const port = config.get("server.port") || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
