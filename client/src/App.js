import { useEffect, useContext } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';
import AppContext from './store/app-context';

import './App.css';

function App() {
  const appContext = useContext(AppContext);
  const { userDispatch, contactsDispatch } = appContext;
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
              error: response.data.message || 'You are not logged in.',
            },
          });
        }
      } catch (error) {
        userDispatch({
          type: 'setError',
          payload: {
            error: 'You are not logged in.',
          },
        });
      }
    }
    getUser();
  }, [userDispatch, contactsDispatch]);

  console.log(appContext);

  return (
    <div>
      <Routes>
        <Route path="/" exact element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
