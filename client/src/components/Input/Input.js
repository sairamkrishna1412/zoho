import React from 'react';

const Input = (props) => {
  const { label, type, id, options, value, onChange } = props;
  return (
    <div className={`text-left my-8 ${props.className}`}>
      <label className="color-gray text-lg" htmlFor={id}>
        {label}
      </label>
      <input
        className="block backg-gray px-3 py-4 rounded-sm outline-none mt-3 w-full"
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        {...options}
      />
    </div>
  );
};

export default Input;
