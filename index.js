const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const keys = require('./config/keys');

const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const errorController = require('./controllers/errorController');

mongoose
  .connect(keys.mongoURI)
  .then(() => {
    console.log('MongoDB server up !!!');
  })
  .catch((err) => {
    console.log("Couldn't connect to mongoDB server.", err);
  });

const app = express();

app.use(cors());
app.use(express.json({ limit: '150kb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.use('/auth', authRoutes);

app.use('/contacts', contactRoutes);

app.use(errorController);

const PORT = 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Couldn't start express app,", err);
  }
  console.log(`App up and running on port : ${PORT}`);
});
