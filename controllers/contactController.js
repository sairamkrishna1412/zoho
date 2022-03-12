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
      console.log(`invalid prop ${el} : ${contact[el]}`);
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
  // console.log(newContact);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    const contactExists = existingContacts.find((el) => {
      // console.log(el[prop], newContact[prop]);
      return String(el[prop]) === String(newContact[prop]);
    });
    if (contactExists) {
      return [
        false,
        `Contact with that ${prop} already exists in your contact list`,
      ];
    }
  }
  return [true];
};

// const checkUpdatedContact = (existingContacts, newContact) => {
//   const props = ['name', 'phone', 'email'];
//   // console.log(newContact);
//   for (let i = 0; i < props.length; i++) {
//     const prop = props[i];
//     const contactExists = existingContacts.find((el) => {
//       // console.log(el[prop], newContact[prop]);
//       return (
//         el._id !== newContact._id &&
//         String(el[prop]) === String(newContact[prop])
//       );
//     });
//     if (contactExists) {
//       return [
//         false,
//         `Contact with that ${prop} already exists in your contact list`,
//       ];
//     }
//   }
//   return [true];
// };

exports.addContact = catchAsync(async (req, res, next) => {
  const user = req.user;
  const newContact = req.body;

  const isValidContact = checkValidContact(newContact);
  if (!isValidContact[0]) {
    return next(new AppError(400, isValidContact[1]));
  }

  const existingContacts = await Contact.find({ user: user._id });
  if (existingContacts.length > 0) {
    console.log(existingContacts);
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

exports.updateContact = catchAsync(async (req, res, next) => {
  const user = req.user;
  const updatedContact = req.body;
  console.log(updatedContact);
  const isValidContact = checkValidContact(updatedContact);
  if (!isValidContact[0]) {
    return next(new AppError(400, isValidContact[1]));
  }

  const existingContacts = await Contact.find({
    user: user._id,
    _id: { $ne: updatedContact._id },
  });
  if (existingContacts.length > 0) {
    const isUpdatedContact = checkNewContact(existingContacts, updatedContact);

    if (!isUpdatedContact[0]) {
      return next(new AppError(400, isUpdatedContact[1]));
    }
  }

  const updatedContactDoc = await Contact.findOneAndUpdate(
    {
      _id: updatedContact._id,
      user: req.user._id,
    },
    updatedContact,
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: updatedContactDoc,
  });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const { id } = req.body;
  const deltedDoc = await Contact.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });
  return res.status(200).json({
    success: true,
  });
});

exports.getContacts = catchAsync(async (req, res, next) => {
  const userContacts = await Contact.find({ user: req.user._id });
  return res.status(200).json({
    success: true,
    data: userContacts,
    length: userContacts.length,
  });
});
