const z = require("zod");

const login = {
  body: z.object({
    email: z
      .string({
        required_error: "email is required",
        invalid_type_error: "email must be a string",
      })
      .min(5, "email minimum 5 characters")
      .max(100, "email maximum 100 characters"),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password minimum 6 characters"),
  }),
};

const signup = {
  body: z.object({
    name: z
      .string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a string",
      })
      .min(2, "Name minimum 2 characters")
      .max(50, "Name maximum 50 characters"),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .email({ message: "Invalid email" }),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(6, "Password minimum 6 characters"),
    confirmPassword: z
      .string({
        required_error: "Confirm password is required",
        invalid_type_error: "Confirm password must be a string",
      })
      .min(6, "Confirm password minimum 6 characters"),
    dateOfBirth: z
      .string({
        required_error: "Date is required",
        invalid_type_error: "Date must be a valid",
      }),
    country: z
      .string({
        required_error: "Country is required",
        invalid_type_error: "Country must be a string",
      })
      .min(3, "Country minimum 3 characters")
      .max(120, "Country maximum 120 characters"),
    profession: z
      .string({
        required_error: "Profession is required",
        invalid_type_error: "Profession must be a string",
      })
      .min(3, "Profession minimum 3 characters")
      .max(120, "Profession maximum 120 characters"),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
};

const changePassword = {
  body: z.object({
    currentPassword: z
      .string({
        required_error: "Current password is required",
        invalid_type_error: "Current password must be a string",
      })
      .min(6, "Password minimum 6 characters"),
    newPassword: z
      .string({
        required_error: "New password is required",
        invalid_type_error: "New password must be a string",
      })
      .min(6, "Password minimum 6 characters"),
    confirmNewPassword: z
      .string({
        required_error: "Confirm new password is required",
        invalid_type_error: "Confirm new password must be a string",
      })
      .min(6, "Confirm password minimum 6 characters"),
  }).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match",
    path: ["confirmNewPassword"],
  }),
};

const updateUserInfo = {
  body: z.object({
    firstName: z
      .string({
        invalid_type_error: "First name must be a string",
      })
      .optional(),
    lastName: z
      .string({
        invalid_type_error: "Last name must be a string",
      })
      .optional(),
    phoneNo: z
      .string({
        invalid_type_error: "Phone number must be a string",
      })
      .min(10, "Phone number must be at least 10 digits")
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be a string",
      })
      .optional(),
  }),
};

module.exports = {
  login,
  signup,
  changePassword,
  updateUserInfo
};