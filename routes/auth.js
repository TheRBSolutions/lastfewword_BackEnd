const { Router } = require("express");
const authSchema = require("../validations/authSchema");
const authController = require("../controllers/auth");
const validate = require("../middleware/validate");
const { authMiddleware } = require("../services/auth");

const router = Router();

// api/auth/signup
router.post("/signup", validate(authSchema.signup), authController.signup);

// api/auth/login
router.post("/login", validate(authSchema.login), authController.login);

// api/auth/refresh
router.get("/refresh", authController.refresh);

// api/auth/forgot-password
router.post("/forgot-password", authController.forgotPassword);

// api/auth/reset-password/:token
router.post("/reset-password/:token", authController.resetPassword);

// api/auth/change-password
router.post(
    "/change-password",
    authMiddleware,
    validate(authSchema.changePassword),
    authController.changePassword);

// api/auth/update-info
router.put(
    "/update-info",
    authMiddleware, // Protect the route with authentication
    validate(authSchema.updateUserInfo), // Validate the incoming data
    authController.updateUserInfo
);

module.exports = router;
