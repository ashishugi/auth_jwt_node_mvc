const express = require('express');
const mongoose = require('mongoose');
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGO_CONNECT_URI;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000,()=>{
    console.log("running at port 3000");
  }))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));