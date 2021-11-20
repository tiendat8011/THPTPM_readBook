const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const keys = require("../config/index");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
  fullName: { type: String, trim: true },
  userType: { type: String, default: "client" },
  phoneNumber: { type: String, trim: true, maxlength: 10 },
  dayOfBirth: { type: String, trim: true },
  avatar: { type: String, trim: true },
  tokens: [{ token: { type: String, required: true } }],

});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id, userType: user.userType, fullName: user?.fullName },
    keys.secret_key,
    {
      expiresIn: 7200,
    }
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống");
  }
  return user;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email không tồn tại trong hệ thống");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Mật khẩu không chính xác");
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  if (user.isModified("dayOfBirth")) {
    user.dayOfBirth = moment(user.dayOfBirth).format("DD/MM/YYYY");
  }
  next();
});


const User = mongoose.model("User", userSchema, "User");

module.exports = User;
