import React, { useEffect, useState } from 'react';

const ErrorOverlay = (props) => {
  const [top, setTop] = useState(window.scrollY);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY);
    window.removeEventListener('scroll', onScroll);
    // passive is set to true for better performance
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`absolute top-0 left-1/2 -translate-x-1/2 p-5 max-w-lg bg-secondary rounded-b-lg text-center text-lg z-30`}
      style={{ top: `${top}px` }}
    >
      <p>{props.message || 'Something went wrong. Please try again'}</p>
    </div>
  );
};

export default ErrorOverlay;
