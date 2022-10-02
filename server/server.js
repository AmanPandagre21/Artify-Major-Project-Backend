const app = require("./app");
const { connectDatabase } = require("./config/db/database");

// port number
const PORT = process.env.PORT || 5000;

// connect the database
connectDatabase();

// Listening the Server
app.listen(PORT, () => {
  console.log(`Server Is Listening on Port Number ${PORT}`);
});
