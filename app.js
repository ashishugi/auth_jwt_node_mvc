const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const { requireAuth } = require("./middleware/authMiddleware");
const authRoute = require("./routes/authRoutes");
dotenv.config();

const app = express();

// middleware
app.use(express.static("public"));
app.use(express.json()); // json data = > javascript objects
app.use(cookieParser());

// view engine
app.set("view engine", "ejs");

// database connection
const dbURI = process.env.MONGO_CONNECT_URI;

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) =>
    app.listen(3000, () => {
      console.log("running at port 3000");
    })
  )
  .catch((err) => console.log(err));

// routes
app.get("/", (req, res) => res.render("home"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies")); // requireAuth -> middleware to render the login in pages only

app.use(authRoute); // this is same as writing all the auth api -> app.get() , app.post() here.

//cookies

//to create cookies
// see cookies in inspect -> application -> cookies
// app.get("/set-cookies", (req, res) => {
//   //res.setHeader("Set-Cookie", "newUser=true"); // here name of the cookies->'newUser' and value-> 'true'
//   // we can use 3rd-party library for this also. = >  npm i cookie-parser

//   // 3rd party
//   res.cookie("newUser", false); // key , value
//   // above cookie will expire after you close the window
//   res.cookie("isEmployee", true, {
//     maxAge: 1000 * 60 * 60 * 24,
//     httpOnly: true,
//   }); /// for 1day
//   // the above isEmployee cookie will expire after 1day
//   // in production res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24 , httpOnly:true })
//   //  it only only http to modify the cookie, not javascript , so that any user cannot change it
//   res.send("you got the cookies");
// });

// //to read to cookies
// app.get("/read-cookies", (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);
//   // cookies.nameOfCookies
//   res.json(cookies);
// });
