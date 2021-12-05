const jwt = require('jsonwebtoken');
// const { promisify } = require('util');
// const veryfyJwt = promisify(jwt.verify);
const keys = require('../config/index');
const User = require('../models/User');

module.exports.authenticate = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    token = token.replace("Bearer ", "")
    const decoded = jwt.verify(token, keys.secret_key);
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });
    if (!user) throw new Error();
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    console.log({error: e})
    res
      .status(401)
      .send({ message: 'Access denied. You must log in to continue.' });
  }
};

module.exports.authorize = (userTypeArray) => {
  return async (req, res, next) => {
    const arr = userTypeArray.split(' ');
    let isAvailable = false
    arr.forEach(async (userType) => {
      const test = await req.user.userType.includes(userType);
      if(test) isAvailable = true;
    })
    try {
      if (!isAvailable)
        throw new Error(
          'Access denied. You are logged in but do not have permission.'
        );
      next();
    } catch (e) {
      res.status(403).json({ message: e.message });
    }
  };
};
