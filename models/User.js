const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// creating user model

//1. creating schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "email is required"], /// value , message if error occures
    unique: true,
    lowercase: true,
    validate: [
      (email) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      },
      "Please enter valid email",
    ], // validator : [function for validating , "error meassage"]
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "minimum length of password is 6"],
  },
});

// this is trigger which will get triggered as new user is saved
userSchema.post("save", function (doc, next) {
  // doc contains the data which is save currently
  console.log("the new user is save in the database");
  next(); // this means go to next middle ware or execute next , if next () is not called then
  // function will go on hold and will not respond
});

// fire  a function before the data is saved to database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(); // creating salt for hashing
  this.password = await bcrypt.hash(this.password, salt); // hashing with salt
  //after this the password will be saved

  // if we use arrow function here then we cannot user 'this' to the current value
  console.log("user is about to be created", this);
  next();
});

// static method to login user
userSchema.statics.login = async function (email, password) {
  console.log("reached here");
  const user = await this.findOne({ email: email }); // this refers to UserModel
  if (user) {
    const auth = await bcrypt.compare(password, user.password); // password which is passed , hashed password which came from database.
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

//2. creating model
const User = mongoose.model("user", userSchema); // user = > database name
module.exports = User;
