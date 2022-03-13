import React, { useState, useContext } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from '../components/Input/Input';
import Contacts from '../components/Contacts/Contacts';
import Loader from '../components/Loader/Loader';
import AppContext from '../store/app-context';

const Home = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const { isLoading, isLoggedIn } = appContext;
  if (isLoading) {
    return <Loader></Loader>;
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
    try {
      e.preventDefault();
      const response = await axios.post('/api/contacts/add', {
        name,
        phone,
        email,
      });
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'addContact',
          payload: { contact: response.data.data },
        });
        appContext.userDispatch({
          type: 'setMessage',
          payload: { message: `Added new contact : ${name}` },
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
              : 'Something went wrong, please try again.',
          },
        });
      }
    } catch (err) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: err.response.data.hasOwnProperty('message')
            ? err.response.data.message
            : 'Something went wrong, please try again.',
        },
      });
    }
  }

  async function logoutHandler(e) {
    try {
      e.preventDefault();
      const response = await axios.post('/auth/logout');
      if (response.status === 200 && response.data.success) {
        appContext.userDispatch({ type: 'logout' });
        appContext.contactsDispatch({
          type: 'setContacts',
          payload: { contacts: [] },
        });
        appContext.userDispatch({
          type: 'setMessage',
          payload: { message: `Logged out.` },
        });
        navigate('/login');
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.hasOwnProperty('message')
              ? response.data.message
              : 'Something went wrong, please try again.',
          },
        });
      }
    } catch (err) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: err.response.data.hasOwnProperty('message')
            ? err.response.data.message
            : 'Something went wrong, please try again.',
        },
      });
    }
  }

  return (
    <div className="container">
      <div className="text-center my-10">
        <div className="flex justify-between items-center">
          <h1 className=" text-3xl font-medium self-center">Contacts</h1>
          <button
            className=" px-5 py-2 bg-secondary text-gray-100 rounded-full cursor-pointer hover:bg-primary hover:text-white"
            onClick={logoutHandler}
          >
            Logout
          </button>
        </div>
        <form onSubmit={addContactHandler} className=" mt-10 max-w-xl mx-auto">
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
        {appContext.contacts.length > 0 && (
          <Contacts contacts={appContext.contacts}></Contacts>
        )}
        {appContext.contacts.length === 0 && (
          <h1 className="mt-10 text-2xl text-gray-400">
            No Contacts yet. Please add contacts.
          </h1>
        )}
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
