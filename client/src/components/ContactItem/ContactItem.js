import React, { useContext, Fragment, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import deleteLogo from './delete.svg';
import editLogo from './edit.svg';
import AppContext from '../../store/app-context';
import Input from '../Input/Input';

const BackdropModal = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-10 backdrop-blur-[2px]"
      onClick={props.onClick}
    />
  );
};

const UpdateModal = (props) => {
  const { contact } = props;
  const [name, setName] = useState(`${contact.name}`);
  const [phone, setPhone] = useState(`${contact.phone}`);
  const [email, setEmail] = useState(`${contact.email}`);

  const onNameChange = (e) => {
    setName(e.target.value);
  };
  const onPhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  function formSubmitHandler(e) {
    e.preventDefault();
    props.onSubmit({ ...contact, name, phone, email });
  }

  return (
    <div className="absolute max-w-xl w-full inset-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-0 z-20">
      <div className=" bg-white shadow-sm rounded-xl p-10">
        <h1 className="text-2xl text-primary font-medium">Update Contact</h1>
        <form onSubmit={formSubmitHandler}>
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
            className="px-10 py-2 bg-primary text-gray-100 rounded-md cursor-pointer block w-1/3 mx-auto mt-9"
            type="submit"
            value="Update"
          />
        </form>
      </div>
    </div>
  );
};

const ContactItem = (props) => {
  const appContext = useContext(AppContext);
  const { contact } = props;
  const { _id } = contact;
  const [isUpdate, setIsUpdate] = useState(false);

  async function deleteHandler(e) {
    try {
      // console.log('deleting : ', _id);
      const response = await axios.delete('/api/contacts/delete', {
        data: { id: _id },
      });
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'deleteContact',
          payload: { _id },
        });
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: { error: 'Could not delete contact' },
        });
      }
    } catch (error) {
      appContext.userDispatch({
        type: 'setError',
        payload: { error: 'Could not delete contact' },
      });
    }
  }

  async function updateHandler(updatedContact) {
    let response;
    try {
      // console.log(updatedContact);
      response = await axios.patch('/api/contacts/update', updatedContact);
      if (response.status === 200 && response.data.success) {
        appContext.contactsDispatch({
          type: 'updateContact',
          payload: { contact: response.data.data },
        });
      } else {
        appContext.userDispatch({
          type: 'setError',
          payload: {
            error: response.data.message
              ? response.data.message
              : 'Could not update contact',
          },
        });
      }
    } catch (error) {
      // console.log(error);
      appContext.userDispatch({
        type: 'setError',
        payload: {
          error: response.data.message
            ? response.data.message
            : 'Could not update contact',
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
          <span className="ml-5" onClick={deleteHandler}>
            <img className="inline" src={deleteLogo} alt="Delete" />
          </span>
        </div>
      </div>
      {isUpdate &&
        ReactDOM.createPortal(
          <BackdropModal onClick={overlayToggler}></BackdropModal>,
          document.getElementById('backdrop-root')
        )}
      {isUpdate &&
        ReactDOM.createPortal(
          <UpdateModal
            contact={contact}
            onSubmit={updateHandler}
          ></UpdateModal>,
          document.getElementById('overlay-root')
        )}
    </Fragment>
  );
};

export default ContactItem;
