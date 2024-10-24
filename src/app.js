const dotenv = require("dotenv");
const express = require("express");
const path = require("path");
const routes = require("../routes");
const { globalError, notFoundError } = require("./error");
const middlewares = require("./middleware");

dotenv.config();

const app = express();

// app middlewares
app.use(middlewares);

// serve static files
app.use(express.static(path.join(__dirname, "..", "public")));

// default url
app.get('/', (req, res) => {
  res.status(200).send('Hello from server');
});

// routes
app.use(routes);

// error handlers
app.use(notFoundError);
app.use(globalError);

module.exports = app;
