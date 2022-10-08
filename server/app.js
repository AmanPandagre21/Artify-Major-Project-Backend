const express = require("express");
const app = express();
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "server/config/config.env" });
}

const errorMiddleware = require("./middleware/error");

// use middlewares
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limt: "50mb", extended: true }));

//import routes
const user = require("./routes/userRoutes");

// use routes
app.use("/api/v1", user);

// error handler middleware
app.use(errorMiddleware);

module.exports = app;
