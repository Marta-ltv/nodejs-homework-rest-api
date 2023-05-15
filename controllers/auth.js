const {User} = require("../models/user");
const { HttpError, ctrlWrapper } = require('../helpers');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { jimp } = require('../middlewares');
const uuid = require('uuid');

const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarUrl = gravatar.url(email, { s: '200', r: 'pg', d: '404' });
    const verificationToken = uuid.v4();
    await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: avatarUrl,
    subscription: 'starter',
    verificationToken: verificationToken,
  });

    sendEmail('martalitvinchuk90@gmail.com', verificationToken);

    res.status(201).json({
    user: {
        email,
        subscription: "starter",
        avatarURL: avatarUrl,
        verificationToken: verificationToken,
    },
  });
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
        
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
       throw HttpError(401, "Email or password is wrong");
    }
    const payload = {id: user._id,}
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.status(200).json({
    token,
    user: {
      email,
      subscription: 'starter',
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
    await User.findByIdAndUpdate(_id, {token: ""});
    res.status(204).json();
}

const updateUserStatus = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  const user = await User.findByIdAndUpdate(_id, { subscription });
  res.status(200).json({
    data: { user },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;

  const avatarFileName = `${_id}_${originalname}`;
  const resultUpload = path.join('public', 'avatars', avatarFileName);

  try {
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('public', 'avatars', avatarFileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tempUpload);
  }
  jimp(resultUpload);
};

// const userVerification = async (req, res) => {
//   const { verificationToken } = req.params;
//   const user = await User.findOne({ verificationToken: verificationToken });
//   if (!user) {
//     throw HttpError(404, 'User not found');
//   }
//   await User.findOneAndUpdate(
//     { email: user.email },
//     {
//       verificationToken: null,
//       verify: true,
//     }
//   );
//   res.status(200).json({
//     status: 'OK',
//     message: 'Verification successful',
//   });
// };

// const resendEmail = async (req, res) => {
//   const user = await User.findOne(req.body);
//   if (!user.verificationToken) {
//     throw HttpError(409, 'Email has already been verified ');
//   }
//   sendEmail('martalitvinchuk@gmail.com', user.verificationToken);

//   res.status(200).json({
//     status: 'OK',
//     message: 'Verification email sent',
//   });
// };

module.exports = {
  register: ctrlWrapper(register),
  logIn: ctrlWrapper(login),
  logOut: ctrlWrapper(logout),
  getCurrentUser: ctrlWrapper(getCurrent),
  updateUserStatus: ctrlWrapper(updateUserStatus),
  updateAvatar: ctrlWrapper(updateAvatar),
  userVerification: ctrlWrapper(userVerification),
  resendEmail: ctrlWrapper(resendEmail),
};