import { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import ErrorOverlay from './components/ErrorOverlay/ErrorOverlay';
import AppContext from './store/app-context';

import './App.css';

function App() {
  const appContext = useContext(AppContext);
  const { userDispatch, contactsDispatch, error } = appContext;
  useEffect(() => {
    if (error) {
      let timer = setTimeout(() => {
        userDispatch({ type: 'setError', payload: { error: null } });
      }, 3500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [error, userDispatch]);

  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get('/api/user');
        if (response.status === 200 && response.data.success) {
          userDispatch({
            type: 'setUser',
            payload: { user: response.data.data },
          });
          const contactsRes = await axios.get('/api/contacts');
          if (
            contactsRes.status === 200 &&
            contactsRes.data.success &&
            contactsRes.data.data.length > 0
          ) {
            contactsDispatch({
              type: 'setContacts',
              payload: { contacts: contactsRes.data.data },
            });
          }
        } else {
          userDispatch({
            type: 'setError',
            payload: {
              error: response.data.hasOwnProperty('message')
                ? response.data.message
                : 'You are not logged in, please log in.',
            },
          });
        }
      } catch (error) {
        userDispatch({
          type: 'setError',
          payload: {
            error: error.response.data.hasOwnProperty('message')
              ? error.response.data.message
              : 'You are not logged in, please log in.',
          },
        });
      }
    }
    getUser();
  }, [userDispatch, contactsDispatch]);

  return (
    <div>
      {error &&
        ReactDOM.createPortal(
          <ErrorOverlay message={error}></ErrorOverlay>,
          document.getElementById('error-root')
        )}
      <Routes>
        <Route path="/" exact element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
