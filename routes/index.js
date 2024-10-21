const { Router } = require("express");
const authRouters = require("./auth");
const contentRouters = require("./content");

const router = Router();

// auth routes
router.use("/api/auth", authRouters);

// content routes
router.use("/api/content", contentRouters);

module.exports = router;
