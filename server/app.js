const express = require("express");
const app = express();
const bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "server/config/config.env" });
}

const errorMiddleware = require("./middleware/error");

// use middlewares

//import routes

// use routes

// error handler middleware
app.use(errorMiddleware);

module.exports = app;
