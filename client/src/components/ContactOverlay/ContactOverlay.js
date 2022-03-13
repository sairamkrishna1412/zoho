import React, { useState } from 'react';
import Input from '../Input/Input';
import closeSvg from './close.svg';

const ContactOverlay = (props) => {
  const { contact } = props;
  const [name, setName] = useState(`${contact.name}`);
  const [phone, setPhone] = useState(`${contact.phone}`);
  const [email, setEmail] = useState(`${contact.email}`);

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  function formSubmitHandler(e) {
    e.preventDefault();
    props.onSubmit({ ...contact, name, phone, email });
  }

  return (
    <div className="absolute max-w-xl w-full inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-0 z-20">
      <div className=" bg-white shadow-md rounded-xl">
        <p className="flex justify-end pt-3 pr-3">
          <img
            className="cursor-pointer"
            onClick={props.onClose}
            src={closeSvg}
            alt="X"
          />
        </p>
        <div className="p-10">
          <h1 className="text-2xl text-primary font-medium">Update Contact</h1>
          <form onSubmit={formSubmitHandler}>
            <Input
              label="Name"
              type="text"
              id="name"
              value={name}
              onChange={onNameChange}
              options={{ minLength: 3, maxLength: 20 }}
            ></Input>
            <Input
              label="Phone"
              type="tel"
              id="phone"
              value={phone}
              onChange={onPhoneChange}
              options={{ pattern: '[0-9]{10}' }}
            ></Input>
            <Input
              label="Email"
              type="email"
              id="email"
              value={email}
              onChange={onEmailChange}
            ></Input>
            <input
              className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer block w-1/3 mx-auto mt-9"
              type="submit"
              value="Update"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactOverlay;
