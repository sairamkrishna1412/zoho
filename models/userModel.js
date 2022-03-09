const mongoose = require('mongoose');
const validator = require('validator');
const brcypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: [true, 'Account with this email already exists.'],
    required: [true, 'Email is a required field.'],
    validate: {
      validator: (val) => {
        return validator.isEmail(val);
      },
      message: '{VALUE} is not a valid email.',
    },
  },

  password: {
    type: String,
    required: [true, 'Password is a required field.'],
  },

  secret: {
    type: String,
    required: [true, 'Secret is a required field'],
  },

  contacts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Contact',
    default: [],
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await brcypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.comparePassword = async function (
  givenPassword,
  actualPassword
) {
  return await brcypt.compare(givenPassword, actualPassword);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
