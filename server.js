const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" }); // Load environment variables from config.env file

const http = require("http");
const geturl = require("./utils/get_connection_url.js");
const app = require("./app.js");
const server = http.createServer(app); // Create an HTTP server using the Express app

const host = process.env.host; // Host for the server from environment variables
const port = process.env.port; // Port for the server from environment variables

const { 
  colorBright, 
  colorFgCyan, 
  colorRed, 
  colorReset, 
  colorPurple, 
  colorFgGreen 
} = require("./color_codes.js"); // Import color codes for console logs

console.log(`${colorFgCyan}mode:${colorReset} ${colorBright}${colorPurple}${process.env.mode}${colorReset}`);

// If there is an unhandled promise rejection, log the error and shut down the server gracefully
process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});

// If there is an uncaught exception, log the error and shut down the server gracefully
process.on("uncaughtException", (err) => {
  console.log(err);
  server.close(() => {
    process.exit();
  });
});

const url = geturl("test", process.env.user, process.env.password); // Get MongoDB connection URL

mongoose.connect(url).catch((err) => console.log("error encountered")); // Connect to MongoDB
const db = mongoose.connection;

db.once("open", () => {
  const portused = db.port; // Port used for MongoDB connection
  console.log("\033[104mPort used for mongoDB connection:\033[0m", portused);
});

db.on("error", (err) => {
  console.log(err); // Log any MongoDB connection errors
});

// Start the server and listen on specified host and port
server.listen(port, host, (err) => {
  if (err) {
    console.error(`Error starting the server: ${err}`);
  } else {
    console.log(
      `${colorBright}${colorFgGreen}Server is listening on ${colorFgCyan}http://${host}:${port}${colorReset}`
    );
  }
});

// New Features

// Graceful shutdown on SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  console.log("\nclosing the server....");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});

// Graceful shutdown on SIGTERM signal (e.g., kill command)
process.on('SIGTERM', () => {
  console.log("\nshutting the server....");
  server.close(() => {
    console.log("Server closed");
    mongoose.connection.close(false, () => {
      console.log("MongoDB connection closed");
      process.exit(0);
    });
  });
});
