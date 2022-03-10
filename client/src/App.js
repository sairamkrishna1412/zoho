import { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Home from './pages/Home';

import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function getContacts() {
      const contacts = await axios.get('/api/contacts');
      setContacts(contacts);
    }
    getContacts();
  }, [setContacts]);
  console.log(contacts);

  return (
    <div className="App">
      <Routes>
        <Route path="/" exact element={<Home></Home>}></Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/login" element={<Login></Login>}></Route>
      </Routes>
    </div>
  );
}

export default App;
