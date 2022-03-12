import React from 'react';
import ContactItem from '../ContactItem/ContactItem';

const Contacts = (props) => {
  const { contacts } = props;
  const contactItems = contacts.map((contact, index) => (
    <ContactItem contact={contact} key={index}></ContactItem>
  ));

  return (
    <div className="mt-14 rounded-md">
      <div className="grid grid-cols-5 bg-primary py-5 rounded-t-xl text-xl font-medium">
        <p>Name</p>
        <p>Phone</p>
        <p className="col-span-2">Email</p>
        <p>Actions</p>
      </div>
      <div className="rounded-b-xl flex flex-col gap-2 border-x-[1px] border-b-[1px]">
        {contactItems}
      </div>
    </div>
  );
};

export default Contacts;
