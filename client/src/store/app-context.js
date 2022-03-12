import React, { useReducer } from 'react';

const initState = {
  isLoggedIn: false,
  // setIsLoggedIn: () => {},
  isLoading: true,
  error: null,
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
        error: null,
        contacts: [...action.payload.contacts],
      };
    case 'addContact': {
      return {
        ...state,
        isLoading: false,
        error: null,
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
        contacts: newContacts,
      };
    }
    case 'deleteContact': {
      const newContacts = state.contacts.filter(
        (contact) => contact._id !== action.payload._id
      );
      return { ...state, contacts: newContacts };
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
      return { ...state, isLoading: false, error: action.payload.error };

    case 'setUser':
      return {
        ...state,
        isLoggedIn: true,
        isLoading: false,
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
        error: user.error,
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
