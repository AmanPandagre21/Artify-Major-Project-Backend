const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: "server/config/config.env" });
}

const errorMiddleware = require("./middleware/error");

// use middlewares
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limt: "50mb", extended: true }));
app.use(cors());

//import routes
const user = require("./routes/userRoutes");
const wishlist = require("./routes/wishlistRoutes");
const category = require("./routes/categoryRoutes");
const posts = require("./routes/postsRoutes");

// use routes
app.use("/api/v1", user);
app.use("/api/v1", wishlist);
app.use("/api/v1", category);
app.use("/api/v1", posts);

app.get("/", (req, res) => {
  res.send("Server is running");
});

// error handler middleware
app.use(errorMiddleware);

module.exports = app;
