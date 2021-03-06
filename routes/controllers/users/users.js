const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const sharp = require('sharp');
const { sendRegisterEmail } = require("../../../services/email/sendRegisterEmail");
// const { promisify } = require('util');
// const comparePassword = promisify(bcrypt.compare);
// const jwtSign = promisify(jwt.sign);


/**
 * @todo api for User
 */
module.exports.createUser = async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).json(e);
    }
};


module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((user) => {
      user = user.filter((user) => user.userType !== 'admin');
      return res.status(200).json(user);
    })
    .catch((err) => res.status(500).json(err));
};

module.exports.getUserById = async (req, res, next) => {
  res.send(req.user);
};

module.exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error('User not found');

    await user.remove();
    return res.status(200).send({ message: 'Delete user successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: e.message });
  }
};

module.exports.updateUserById = async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['fullName', 'email', 'phoneNumber', 'dayOfBirth'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation)
    return res.status(400).send({ error: 'Invalid updates!' });

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));

    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports.setAdmin = async (req, res, next) => {
  req.user.userType = 'admin';
  await req.user.save();
  res.status(200).send({ message: 'Ok!' });
};

module.exports.setClient = async (req, res, next) => {
  req.user.userType = 'client';
  await req.user.save();
  res.status(200).send({ message: 'Ok!' });
};

module.exports.updatePasswordUser = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const isMatch = await bcrypt.compare(oldPassword, req.user.password);
    if (!isMatch)
      return res.status(400).send({ error: 'Old password is incorrect!' });
    req.user.password = newPassword;
    await req.user.save();
    res.status(200).send({ message: 'Update password successfully!' });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    res.json({ message: e.message, status: 400 });
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send({ message: 'Logout successfully!' });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports.logoutAll = async (req, res, next) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send({ message: 'Logout all device successfully!' });
  } catch (e) {
    res.status(500).send();
  }
};
/**
 * @todo api Avatar
 */
module.exports.uploadAvatar = async (req, res, next) => {
  try {
    req.user.avatar = req.file.location;
    await req.user.save(req.user);
    res.status(201).send({
      message: 'Upload message successfully',
      avatar: req.user.avatar,
    });
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
};

module.exports.deleteAvatar = async (req, res, next) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send({ message: 'Delete avatar successfully!' });
  } catch (e) {
    res.status(500).send();
  }
};

module.exports.getAvatarById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar)
      throw new Error("User not found or User don't have avatar");
    res.status(200).send({
      avatar: user.avatar,
    });
  } catch (e) {
    res.status(404).send({ message: e.message });
  }
};
