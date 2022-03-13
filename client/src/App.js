import { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import MessageOverlay from './components/MessageOverlay/MessageOverlay';
import AppContext from './store/app-context';

import './App.css';

function App() {
  const appContext = useContext(AppContext);
  const { userDispatch, contactsDispatch, message } = appContext;
  useEffect(() => {
    if (message) {
      let timer = setTimeout(() => {
        userDispatch({ type: 'setMessage', payload: { message: null } });
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message, userDispatch]);

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
      } catch (err) {
        userDispatch({
          type: 'setError',
          payload: {
            error: err.response.data.hasOwnProperty('message')
              ? err.response.data.message
              : 'You are not logged in, please log in.',
          },
        });
      }
    }
    getUser();
  }, [userDispatch, contactsDispatch]);

  return (
    <div>
      {message &&
        ReactDOM.createPortal(
          <MessageOverlay message={message}></MessageOverlay>,
          document.getElementById('message-root')
        )}
      <Routes>
        <Route path="/" exact element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>} exact></Route>
        <Route path="/login" element={<Login></Login>} exact></Route>
      </Routes>
    </div>
  );
}

export default App;
