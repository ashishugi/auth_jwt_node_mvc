const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleError = (err) => {
  let error = { email: "", password: "" };
  // if (err.message.includes("user validation failed")) {
  // }
  //some error identify that

  return "some error occurred here";
};

const maxAge = 3 * 24 * 60 * 60;
const createJWTToken = (id) => {
  return jwt.sign({ id }, "some screet string should be placed here", {
    expiresIn: maxAge, // times given in seconds
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};
module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password }); // inserts the data to <mongoDB></mongoDB>
    const token = createJWTToken(user._id); // this is mongooDB id
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // nameof cookie , value of item ,
    res.status(201).json({ user: user._id }); // return thr user json back as response
  } catch (err) {
    const error = handleError(err);
    console.log(error);
    res.status(400).send(err);
  }
};
module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createJWTToken(user._id); // this is mongooDB id
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 }); // nameof cookie , value of item ,

    res.status(200).json({ user: user._id });
  } catch (err) {
    res.status(400).json("invalid");
  }
};

module.exports.logout_get = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
