import React, { useContext, Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import deleteLogo from './delete.svg';
import editLogo from './edit.svg';
import AppContext from '../../store/app-context';
import Backdrop from '../Backdrop/Backdrop';
import ContactOverlay from '../ContactOverlay/ContactOverlay';

const ContactItem = (props) => {
  const appContext = useContext(AppContext);
  const { contact } = props;
  const { _id } = contact;
  const [isUpdate, setIsUpdate] = useState(false);

  async function deleteHandler(e) {
    try {
      const response = await axios.delete('/api/contacts/delete', {
        data: { id: _id },
      });
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'deleteContact',
          payload: { _id },
        });
        appContext.userDispatch({
          type: 'setMessage',
          payload: { message: `Deleted contact : ${contact.name}` },
        });
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.hasOwnProperty('message')
              ? response.data.message
              : 'Contact delete failed, please try again.',
          },
        });
      }
    } catch (err) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: err.response.data.hasOwnProperty('message')
            ? err.response.data.message
            : 'Contact delete failed, please try again.',
        },
      });
    }
  }

  async function updateHandler(updatedContact) {
    try {
      // console.log(updatedContact);
      const response = await axios.patch(
        '/api/contacts/update',
        updatedContact
      );
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'updateContact',
          payload: { contact: response.data.data },
        });
        appContext.userDispatch({
          type: 'setMessage',
          payload: { message: `Updated contact : ${contact.name}` },
        });
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.hasOwnProperty('message')
              ? response.data.message
              : 'Contact update failed, please try again.',
          },
        });
      }
    } catch (err) {
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: err.response.data.hasOwnProperty('message')
            ? err.response.data.message
            : 'Contact update failed, please try again.',
        },
      });
    } finally {
      setIsUpdate(false);
    }
  }

  function overlayToggler(e) {
    setIsUpdate((prevState) => !prevState);
  }

  return (
    <Fragment>
      <div className="grid grid-cols-5 py-5 border-b-[1px]">
        <p>{contact.name}</p>
        <p>{contact.phone}</p>
        <p className="col-span-2">{contact.email}</p>
        <div>
          <span className="cursor-pointer" onClick={overlayToggler}>
            <img className="inline" src={editLogo} alt="Edit" />
          </span>
          <span className="ml-5 cursor-pointer" onClick={deleteHandler}>
            <img className="inline" src={deleteLogo} alt="Delete" />
          </span>
        </div>
      </div>
      {isUpdate &&
        ReactDOM.createPortal(
          <Backdrop onClick={overlayToggler}></Backdrop>,
          document.getElementById('backdrop-root')
        )}
      {isUpdate &&
        ReactDOM.createPortal(
          <ContactOverlay
            onClose={overlayToggler}
            contact={contact}
            onSubmit={updateHandler}
          ></ContactOverlay>,
          document.getElementById('overlay-root')
        )}
    </Fragment>
  );
};

export default ContactItem;
