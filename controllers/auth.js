const { User } = require("../models/user");
const { HttpError, ctrlWrapper, sendEmail } = require("../helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { jimp } = require("../middlewares");
const { v4: uuidv4 } = require("uuid");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: '404' });
  const verificationToken = uuidv4();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarUrl,
    verificationToken,
  });

  const verify = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`
  }

  await sendEmail(verify);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
      avatarURL: avatarUrl,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: "",
  });
  res.status(200).json({
    status: 'OK',
    message: 'Verification successful',
  });
}

const resendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }
  const user = await User.findOne({ email });
  if (!user) {
      return res.status(404).json({ message: "User not found" });
  }
  if (user.verify) {
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
  }
  
  const verify = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`
  }
  await sendEmail(verify);

  return res.status(200).json({ message: "Verification email sent" });
}


const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "User is not verified");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: "starter",
    },
  });
};

const getCurrent = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).json();
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const avatarFileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, avatarFileName);

  try {
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", avatarFileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
  }
  jimp(resultUpload);
};

module.exports = {
  resendEmail:ctrlWrapper(resendEmail),
  verify:ctrlWrapper(verify),
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};