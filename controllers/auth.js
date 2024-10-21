const jwt = require("jsonwebtoken");
const cookieOption = require("../config/cookieOption");
const { jwtSecret } = require("../config");
const authService = require("../services/auth");
const { sendSuccessResponse } = require('../utils/sendResponse');
const CryptoJS = require("crypto-js");
const sendEmail = require("../utils/sendEmail");

// Signup Controller
const signup = async (req, res, next) => {
  try {
    const { name, email, password, dateOfBirth, country, profession } = req.body;

    const user = {
      name,
      email,
      password,
      dateOfBirth,
      country,
      profession
    };

    await authService.signupUser(user);

    const copiedObj = JSON.parse(JSON.stringify(user));
    delete copiedObj.password;
    delete copiedObj.passwordConfirm;
    return sendSuccessResponse(
      res,
      201,
      copiedObj,
      'Account created successfully!'
    );
  } catch (error) {
    next(error);
  }
};

// Login Controller
const login = async (req, res, next) => {
  const { email, password } = req.body;
  const cookies = req.cookies;
  const cookiesToken = cookies?.refreshToken;

  try {
    const loggedInUser = await authService.login({ email, password });

    if (!loggedInUser) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    let newRefreshTokenList = !cookiesToken
      ? loggedInUser.refreshToken || []
      : loggedInUser.refreshToken?.filter((rt) => rt !== cookiesToken) || [];

    if (cookiesToken) {
      const foundToken = await authService.findByProperty(
        "refreshToken",
        cookiesToken
      );

      if (!foundToken) newRefreshTokenList = [];
      res.clearCookie("refreshToken", cookieOption);
    }

    const payload = {
      userId: loggedInUser._id.toString(),
      email: loggedInUser.email,
    };

    const { accessToken, refreshToken } = authService.jwtSignIn(payload);

    loggedInUser.refreshToken = [...newRefreshTokenList, refreshToken];
    await loggedInUser.save();

    res.cookie("refreshToken", refreshToken, cookieOption);

    const copiedObj = JSON.parse(JSON.stringify(loggedInUser));
    delete copiedObj.password;
    delete copiedObj.passwordConfirm;
    copiedObj.token = accessToken;

    return sendSuccessResponse(res, 200, copiedObj, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

// Refresh Token Controller
const refresh = async (req, res) => {
  const cookies = req.cookies;
  const cookiesToken = cookies?.refreshToken;

  if (!cookiesToken) {
    return res.status(401).json({ message: "Unauthorized!" });
  }

  res.clearCookie("refreshToken", cookieOption);

  const foundUser = await authService.findByProperty("refreshToken", cookiesToken);

  if (!foundUser) {
    jwt.verify(cookiesToken, jwtSecret.refresh, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden!" });
      }

      const decodedId = decoded.userId;
      const hackedUser = await authService.findByProperty("_id", decodedId);

      if (hackedUser) {
        hackedUser.refreshToken = [];
        await hackedUser.save();
      }
    });

    return res.status(403).json({ message: "Forbidden!" });
  }

  const newRefreshTokenList = foundUser?.refreshToken?.filter((rt) => rt !== cookiesToken) || [];

  jwt.verify(cookiesToken, jwtSecret.refresh, async (err, decoded) => {
    if (err || foundUser?._id.toString() !== decoded.userId) {
      return res.status(403).json({ message: "Forbidden!" });
    }

    const payload = {
      userId: foundUser._id.toString(),
      email: foundUser.email,
      role: foundUser.role,
    };

    const jwtSign = authService.jwtSignIn(payload);

    foundUser.refreshToken = [...newRefreshTokenList, jwtSign.refreshToken];
    await foundUser.save();

    res.cookie("refreshToken", jwtSign.refreshToken, cookieOption);

    return res.json({ accessToken: jwtSign.accessToken });
  });
};

// Forgot Password Controller
const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await authService.findByProperty("email", email);

    if (!user) {
      return res.status(404).json({ message: "User not found with this email!" });
    }

    const resetToken = CryptoJS.lib.WordArray.random(20).toString();

    const base64ResetToken = Buffer.from(resetToken).toString('base64');

    user.resetPasswordToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex);
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const resetUrl = `https://lettolino.vercel.app/reset-password/${base64ResetToken}`;

    // HTML content with a button linking to the reset URL
    const message = `
      <p>You are receiving this email because you (or someone else) has requested a reset of your password. Please click the button below to reset your password:</p>
      <a href="${resetUrl}" style="text-decoration: none; display: flex;">
        <button style="background-color: #e4a958; color: white; padding: 10px 20px; border: none; border-radius: 10px; margin: auto; font-size: 16px;">
          Reset Password
        </button>
      </a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message, // Sending HTML content
      });

      return sendSuccessResponse(res, 200, null, "Email sent successfully.");
    } catch (err) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return next(new Error("Email could not be sent."));
    }
  } catch (error) {
    next(error);
  }
};

// Reset Password Controller
const resetPassword = async (req, res, next) => {

  const resetToken = Buffer.from(req.params.token, 'base64').toString('utf-8');
  const hashedToken = CryptoJS.SHA256(resetToken).toString(CryptoJS.enc.Hex);

  try {
    const user = await authService.findByProperty("hashedToken", hashedToken);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token!" });
    }

    if (Date.now() > user.resetPasswordExpire) {
      return res.status(400).json({ message: "Token has expired!" });
    }

    user.password = req.body.password;
    user.hashedToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();


    return sendSuccessResponse(res, 200, null, "Password reset successfully.");
  } catch (error) {
    next(error);
  }
};

// Change Password Controller
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Check if new passwords match
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "New passwords do not match!" });
    }

    const userId = req.userId; // Assuming you get the logged-in userId from middleware

    // Find the user by their ID
    const user = await authService.findByProperty("_id", userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the current password is correct
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Current password is incorrect!" });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    return sendSuccessResponse(res, 200, null, "Password updated successfully!");
  } catch (error) {
    next(error);
  }
};

// Update User Info Controller
const updateUserInfo = async (req, res, next) => {
  try {
    const { firstName, lastName, phoneNo, address } = req.body;

    const userId = req.userId; // Assuming the user ID is passed from middleware

    // Find the user by their ID
    const user = await authService.findByProperty("_id", userId);

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Update the fields if they are provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNo) user.phoneNo = phoneNo;
    if (address) user.address = address;

    // Save the updated user information
    await user.save();

    return sendSuccessResponse(res, 200, user, "User information updated successfully!");
  } catch (error) {
    next(error);
  }
};


module.exports = {
  signup,
  login,
  refresh,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserInfo
};
