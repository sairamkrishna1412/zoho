const validator = require('validator');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const Contact = require('../models/contactModel');

const checkValidContact = (contact) => {
  const props = ['name', 'phone', 'email'];
  let el;
  for (let i = 0; i < props.length; i++) {
    el = props[i];
    if (!contact.hasOwnProperty(el) || String(contact[el]).trim().length == 0) {
      return [false, `Please enter a valid ${el}`];
    }
  }

  const phoneLength = String(contact.phone).length;
  if (phoneLength < 10 || phoneLength > 15) {
    return [
      false,
      `Phone number should be a minimum of 10 digits and maximum of 15 digits`,
    ];
  }

  if (!validator.isEmail(contact.email)) {
    return [false, `Please enter a valid email address`];
  }

  return [true];
};

const checkNewContact = (existingContacts, newContact) => {
  const props = ['name', 'phone', 'email'];
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    const contactExists = existingContacts.find(
      (el) => el.prop === newContact.prop
    );
    if (contactExists) {
      [false, `Contact with that ${prop} already exists in your contact list`];
    }
  }
  return [true];
};

exports.addContact = catchAsync(async (req, res, next) => {
  const user = req.user;
  const newContact = req.body;

  const isValidContact = checkValidContact(newContact);
  if (!isValidContact[0]) {
    return next(new AppError(400, isValidContact[1]));
  }

  const existingContacts = await Contact.find({ user: user._id });
  if (existingContacts.length > 0) {
    const isNewContact = checkNewContact(existingContacts, newContact);
    if (!isNewContact[0]) {
      return next(new AppError(400, isNewContact[1]));
    }
  }

  const contactDoc = await Contact.create({
    name: newContact.name,
    phone: newContact.phone,
    email: newContact.email,
    user: user._id,
  });

  return res.status(200).json({
    success: true,
    data: contactDoc,
  });
});

exports.updateContact = (req, res, next) => {
  // const user = req.user;
};
exports.deleteContact = (req, res, next) => {};

exports.getContacts = catchAsync(async (req, res, next) => {
  const userContacts = await Contact.find({ user: req.user._id });
  res.status(200).json({
    success: true,
    data: userContacts,
    length: userContacts.length,
  });
});
