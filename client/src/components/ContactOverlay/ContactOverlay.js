import React, { useContext, useState } from 'react';
import Input from '../Input/Input';
import AppContext from '../../store/app-context';

const ContactOverlay = (props) => {
  const { contact } = props;
  const appContext = useContext(AppContext);
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

  return (
    <div className="hidden max-w-xl w-full">
      <div className=" bg-white shadow-sm rounded-xl p-10">
        <h1 className="text-2xl text-primary font-medium">Update Contact</h1>
        <form>
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
            className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer w-1/3 mt-8"
            type="submit"
            value="Update"
          />
        </form>
      </div>
    </div>
  );
};

export default ContactOverlay;
