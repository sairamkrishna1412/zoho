import React, { useReducer } from 'react';

const initState = {
  isLoggedIn: false,
  // setIsLoggedIn: () => {},
  isLoading: true,
  message: null,
  // setIsLoading: () => {},
  contacts: [],
  user: {},
  contactsDispatch: () => {},
  userDispatch: () => {},
  // setContacts: () => {},
  // addContact: () => {},
  // updateContact: () => {},
  // deleteContact: () => {},
};

const AppContext = React.createContext(initState);
export default AppContext;

function contactReducer(state, action) {
  switch (action.type) {
    case 'setContacts':
      return {
        ...state,
        isLoading: false,
        message: null,
        contacts: [...action.payload.contacts],
      };
    case 'addContact': {
      return {
        ...state,
        isLoading: false,
        message: null,
        contacts: [...state.contacts, action.payload.contact],
      };
    }
    case 'updateContact': {
      const newContacts = state.contacts.map((contact) => {
        if (contact._id === action.payload.contact._id) {
          return action.payload.contact;
        }
        return contact;
      });
      return {
        ...state,
        isLoading: false,
        message: null,
        contacts: newContacts,
      };
    }
    case 'deleteContact': {
      const newContacts = state.contacts.filter(
        (contact) => contact._id !== action.payload._id
      );
      return {
        ...state,
        isLoading: false,
        message: null,
        contacts: newContacts,
      };
    }
    default:
      return state;
  }
}

function userReducer(state, action) {
  switch (action.type) {
    case 'setLoggedIn':
      return { ...state, isLoggedIn: action.payload.isLoggedIn };

    case 'setIsLoading':
      return { ...state, isLoading: action.payload.isLoading };

    case 'setError':
      return { ...state, isLoading: false, message: action.payload.error };

    case 'setMessage':
      return { ...state, isLoading: false, message: action.payload.message };

    case 'logout':
      return {
        ...state,
        isLoggedIn: false,
        isLoading: false,
        message: null,
        contacts: [],
        user: {},
      };

    case 'setUser':
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
        message: null,
        user: action.payload.user,
      };

    default:
      return state;
  }
}

export const ContextProvider = (props) => {
  const [contacts, contactsDispatch] = useReducer(contactReducer, initState);
  const [user, userDispatch] = useReducer(userReducer, initState);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn: user.isLoggedIn,
        isLoading: user.isLoading,
        message: user.message,
        contacts: contacts.contacts,
        user: user.user,
        contactsDispatch,
        userDispatch,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
