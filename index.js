const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
require("dotenv").config();

const app = express();
const connectDB = require("./connectMongo");

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-frontend-url.vercel.app" // Replace with your frontend URL
      : "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

console.log("CORS configuration applied with options: ", corsOptions);

// Middleware
app.use(express.json());
console.log("Express JSON middleware applied");

// Connect to MongoDB with error handling
const connectWithRetry = async () => {
  try {
    console.log("Attempting to connect to MongoDB...");
    await connectDB();
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB: ", error);
    setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
  }
};
connectWithRetry();

// Routes
app.get("/", (req, res) => {
  console.log("GET request received at '/' route");
  res.status(200).send("Server is up and running");
});

app.get("/api/data", (req, res) => {
  console.log("GET request received at '/api/data' route");
  res.json({ message: "Hello from serverless function!" });
});

// Server listening or serverless export
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} else {
  console.log("Running in serverless mode");
  module.exports.handler = serverless(app);
}
