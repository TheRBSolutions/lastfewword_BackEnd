const jwt = require("jsonwebtoken");
const Auth = require("../models/Auth");
const errorMessage = require("../utils/errorMessage");
const { jwtSecret } = require("../config");

// jwt sign in service
const jwtSignIn = (payload) => {
  const accessToken = jwt.sign(payload, jwtSecret.access, {
    expiresIn: "15d",
  });

  const refreshToken = jwt.sign(payload, jwtSecret.refresh, {
    expiresIn: "15d",
  });

  return { accessToken, refreshToken };
};

// find by property
const findByProperty = (key, value) => {
  if (!key || !value) return null;

  if (key === "_id") {
    return Auth.findById(value);
  }

  return Auth.findOne({ [key]: value });
};

// create a new user
const signupUser = async (data) => {
  const isAuth = await Auth.isEmailExist(data.email);

  if (isAuth) throw errorMessage(`'${data.email}' already registered!`, 400);

  return Auth.create(data);
};

// login
const login = async ({ email, password }) => {
  const auth = await findByProperty("email", email);

  if (!auth) throw errorMessage("Incorrect email or password!", 400);

  const isPasswordMatch = await auth.comparePassword(password);
  if (!isPasswordMatch)
    throw errorMessage("Incorrect email or password!", 400);

  return auth;
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token provided!" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret.access);
    req.userId = decoded.userId; // Attach the userId to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Forbidden, invalid token!" });
  }
};

module.exports = {
  signupUser,
  findByProperty,
  login,
  jwtSignIn,
  authMiddleware
};
