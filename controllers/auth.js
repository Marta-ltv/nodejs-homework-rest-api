const {User} = require("../models/user");
const { HttpError, ctrlWrapper } = require('../helpers');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = process.env;


const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
    user: {
        email: newUser.email,
        subscription: "starter",
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


module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}








// const decodeToken = jwt.decode(token);
// console.log(decodeToken);

// try {
//   const { id } = jwt.verify(token, SECRET_KEY);
//   console.log(id);
//   const invalidToken = ""
//   const result = jwt.verify(invalidToken, SECRET_KEY)
// }
// catch (error) {
//   console.log(error.message);
// }