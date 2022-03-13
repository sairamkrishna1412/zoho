import React, { useState, useContext } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '../components/Input/Input';
import axios from 'axios';
import AppContext from '../store/app-context';

const Login = () => {
  const navigate = useNavigate();
  const appContext = useContext(AppContext);
  const { isLoading, isLoggedIn, user } = appContext;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (isLoading) {
    return <h1 className="text-center align-middle">Loading...</h1>;
  }
  if (!isLoading && isLoggedIn && user.hasOwnProperty('_id')) {
    return <Navigate to="/"></Navigate>;
  }

  const formSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      // console.log('trig');
      const response = await axios.post('/auth/login', {
        email,
        password,
      });

      if (response.status === 200 && response.data.success) {
        // console.log('login successfull', response.data.data);
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
              : 'Login failed, please try again.',
          },
        });
      }
    } catch (error) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: error.response.data.hasOwnProperty('message')
            ? error.response.data.message
            : 'Login failed, please try again.',
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

  return (
    <div className="container">
      <div className="mt-20 max-w-2xl mx-auto  text-center">
        <h1 className="text-2xl font-medium">Login</h1>
        <p className=" mt-20 mb-10">
          Don't have an account?
          <Link className="text-primary ml-1 cursor-pointer" to="/signup">
            Signup
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
              className="mb-2"
              type="password"
              label="Password"
              id="password"
              value={password}
              onChange={onPasswordChange}
              options={{ minLength: 8 }}
            ></Input>
            <Link
              className="block text-primary cursor-pointer text-sm text-right"
              to="/"
            >
              Forgot Password ?
            </Link>
            <input
              className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer w-full mt-8"
              type="submit"
              value="Login"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
