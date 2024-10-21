const bcrypt = require("bcryptjs");
const { model, Schema } = require("mongoose");

const authSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Country must be at least 3 characters"],
      maxlength: [120, "Country cannot exceed 120 characters"],
    },
    profession: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Profession must be at least 3 characters"],
      maxlength: [120, "Profession cannot exceed 120 characters"],
    },
    resetToken: {
      type: String
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// hashed password
authSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(this.password, salt);
    this.password = hashed;
  }
  next();
});

// compare password
authSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// is Email exist
authSchema.statics.isEmailExist = async function (email, excludeAuthId) {
  const auth = await this.findOne({ email, _id: { $ne: excludeAuthId } });
  return !!auth;
};

module.exports = model("auth", authSchema);
