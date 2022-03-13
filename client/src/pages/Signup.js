import axios from 'axios';
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input';
import AppContext from '../store/app-context';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secret, setSecret] = useState('');
  const navigate = useNavigate();
  const appContext = useContext(AppContext);

  const formSubmitHandler = async (event) => {
    try {
      // console.log('trig');
      event.preventDefault();
      const response = await axios.post('/auth/signup', {
        email,
        password,
        secret,
      });

      if (response.status === 200 && response.data.success) {
        // console.log('signup successfull', response.data.data);
        appContext.userDispatch({
          type: 'setUser',
          payload: { user: response.data.data },
        });
        navigate('/');
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.hasOwnProperty('message')
              ? response.data.message
              : 'Signup failed, please try again.',
          },
        });
      }
    } catch (error) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: error.response.data.hasOwnProperty('message')
            ? error.response.data.message
            : 'Signup failed, please try again.',
        },
      });
    }
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const onSecretChange = (e) => {
    setSecret(e.target.value);
  };
  return (
    <div className="container">
      <div className="mt-20 max-w-2xl mx-auto  text-center">
        <h1 className="text-2xl font-medium">Signup</h1>
        <p className=" mt-20 mb-10">
          Already have an account?
          <Link className="text-primary ml-1" to="/login">
            Login
          </Link>
        </p>
        <div className="my-5 w-1/2 mx-auto">
          <form onSubmit={formSubmitHandler}>
            <Input
              type="email"
              label="Email"
              id="email"
              value={email}
              onChange={onEmailChange}
            ></Input>
            <Input
              type="password"
              label="Password"
              id="password"
              value={password}
              onChange={onPasswordChange}
            ></Input>
            <Input
              type="text"
              label="Secret"
              id="secret"
              value={secret}
              onChange={onSecretChange}
            ></Input>
            <input
              className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer w-full"
              type="submit"
              value="Sign Up"
            />
          </form>
          <p className="mt-7 text-xs text-gray-400">
            By clicking "Signup" button, you are creating an account, and you
            agree to Terms of use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
