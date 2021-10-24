const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // grab the token from cookies

  const token = req.cookies.jwt; // here 'jwt' is the name of the token present inside the cookie

  // check json web token exist and it is varified
  if (token) {
    jwt.verify(
      token,
      "some screet string should be placed here",
      (err, decodedToken) => {
        if (err) {
          console.log(err.message);
          res.redirect("/login");
        } else {
          console.log(decodedToken);
          next();
        }
      }
    ); // token, secret => same as in authController.js
  } else {
    res.redirect("/login");
  }
};

module.exports = { requireAuth };
