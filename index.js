const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const mongoose = require('mongoose');
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

app.use(
  cookieSession({
    maxAge: 10 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);

app.use(passport.initialize());
app.use(passport.session());

// app.use(express.static(path.join(__dirname, 'client', 'build')));
if (process.env.NODE_ENV === 'production') {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  // const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.use('/auth', authRoutes);

app.use('/api/contacts', contactRoutes);

app.get('/api/user', (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      data: req.user,
    });
  }
  res.status(400).json({
    success: false,
  });
});

app.use(errorController);

const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.log("Couldn't start express app,", err);
  }
  console.log(`App up and running on port : ${PORT}`);
});
