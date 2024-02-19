import React, { useState, useEffect } from 'react';

const TypingIndicator = () => {
  const [dots, setDots] = useState('.');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length === 5) {
          return '.';
        }
        return prevDots + '.';
      });
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return <p className="mb-[-5px] text-xs">Someone is typing{dots}</p>;
};

export default TypingIndicator;
