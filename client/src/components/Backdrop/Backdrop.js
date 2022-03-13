import React from 'react';

const Backdrop = (props) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-screen z-10 backdrop-blur-[2px]"
      onClick={props.onClick}
    />
  );
};

export default Backdrop;
