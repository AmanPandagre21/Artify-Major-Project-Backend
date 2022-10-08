const app = require("./app");
const { connectDatabase } = require("./config/Database/database");

// port number
const PORT = process.env.PORT || 5000;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// connect the database
connectDatabase();

// Listening the Server
app.listen(PORT, () => {
  console.log(`Server Is Listening on Port Number ${PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});
