import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input/Input';
import Contacts from '../components/Contacts/Contacts';
import AppContext from '../store/app-context';

const Home = () => {
  const appContext = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { isLoading, isLoggedIn } = appContext;
  if (isLoading) {
    return <h1 className="text-center align-middle">Loading...</h1>;
  }
  if (!isLoading && !isLoggedIn) {
    return <Navigate to="/login"></Navigate>;
  }

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  async function addContactHandler(e) {
    let response;
    try {
      e.preventDefault();
      response = await axios.post('/api/contacts/add', {
        name,
        phone,
        email,
      });
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'addContact',
          payload: { contact: response.data.data },
        });
        setName('');
        setPhone('');
        setEmail('');
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.hasOwnProperty('message')
              ? response.data.message
              : 'Something went wrong.',
          },
        });
      }
    } catch (error) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: response.data.hasOwnProperty('message')
            ? response.data.message
            : 'Something went wrong.',
        },
      });
    }
  }

  return (
    <div className="container">
      <div className="text-center my-10">
        <h1 className=" text-3xl font-medium">Contacts</h1>
        <form onSubmit={addContactHandler} className="mt-20 max-w-xl mx-auto">
          <h1 className="text-xl">Add Contact</h1>
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
            className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer w-full mt-8"
            type="submit"
            value="Save"
          />
        </form>
      </div>
      <hr />
      <div className="my-20 text-center max-w-5xl mx-auto">
        <h1 className=" text-2xl">My Contacts</h1>
        <Contacts contacts={appContext.contacts}></Contacts>
        {/* <div className="mt-14 rounded-md">
          <div className="grid grid-cols-3 bg-primary py-5 rounded-t-xl text-xl font-medium">
            <p>Name</p>
            <p>Phone</p>
            <p>Email</p>
          </div>
          <div className="rounded-b-xl flex flex-col gap-2 border-x-[1px] border-b-[1px]">
            <div className="grid grid-cols-3 py-5 border-b-[1px] cursor-pointer hover:-translate-y-0.5 transition-transform">
              <p>Shiva Ram Krishna Durgi</p>
              <p>+91 7036202095</p>
              <p>shivaramkrishna.krishna29@gmail.com</p>
            </div>
            <div className="grid grid-cols-3 py-5 border-b-[1px] cursor-pointer hover:-translate-y-0.5 transition-transform">
              <p>Sai Ram Krishna</p>
              <p>+91 8328223386</p>
              <p>sairamkrishna1412@gmail.com</p>
            </div>
            <div className="grid grid-cols-3 py-5 cursor-pointer hover:-translate-y-0.5 transition-transform">
              <p>Roopesh hariharan</p>
              <p>+91 9571473132</p>
              <p>roopesh@gmail.com</p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Home;
