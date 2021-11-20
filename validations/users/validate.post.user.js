const validator = require("validator");
const _ = require("lodash");
const { User } = require("../../models/User");

module.exports.validatePostUser = async (req, res, next) => {
  const {
    email,
    password,
    password2,
  } = req.body;

  let errors = {};
  //email
  if (!email) {
    errors.email = "Email is required";
  } else if (!validator.isEmail(email)) {
    errors.email = "Email is invalid";
  } else {
    const user = await User.findOne({ email });
    if (user) errors.email = "This email already exists";
  }

  //password
  if (!password) {
    errors.password = "Password is required";
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.password = "Password at least 3 characters";
  }

  //Verify password
  if (!password2) {
    errors.password2 = "Verify password is required";
  } else if (!validator.equals(password, password2)) {
    errors.password2 = "Passwords must match";
  }

  //Phone number

  if (_.isEmpty(errors)) return next();
  return res.status(400).json(errors);
};
