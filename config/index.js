const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 8000,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017",
  jwtSecret: {
    access: process.env.ACCESS_TOKEN_SECRET || "my-first-jwt-auth-tutorial-is-lettolino",
    refresh: process.env.REFRESH_TOKEN_SECRET || "my-first-jwt-auth-tutorial-is-lettolino",
  },
};
