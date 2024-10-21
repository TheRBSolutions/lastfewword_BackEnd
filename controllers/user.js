const Auth = require("../models/Auth");
const { sendSuccessResponse } = require("../utils/sendResponse");

const profile = async (req, res, next) => {
  try {
    const user = req.user;

    const data = await Auth.findOne({ userName: user.userName }).select(
      "name email"
    );

    return sendSuccessResponse(
      res,
      200,
      data,
      'User profile get successfully!'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { profile };
