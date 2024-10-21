const express = require("express");

const app = require("./api");

require("dotenv").config();

app.use(express.json());

const connectDB = require("./connectMongo");

connectDB();

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
