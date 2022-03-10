const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is a required field.'],
    validate: {
      validator: (val) => {
        return val.trim().length > 0;
      },
      message: 'Name should contain atleast one character.',
    },
  },
  // extension: {
  //   type: Number,
  //   default: 91,
  // },
  phone: {
    type: Number,
    validate: {
      validator: (val) => {
        const valLength = String(val).trim().length;
        return valLength >= 10 && valLength <= 15;
      },
      message: (props) =>
        `${props.value} should 10 digits long. Given number has only ${props.value.length} digits`,
    },
  },
  email: {
    type: String,
    unique: [true, 'Account with this email already exists.'],
    required: [true, 'Email is a required field.'],
    validate: {
      validator: (val) => {
        return validator.isEmail(val);
      },
      message: (props) => `${props.value} is not a valid email.`,
    },
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Enter which user this contact belongs to'],
  },
});

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
