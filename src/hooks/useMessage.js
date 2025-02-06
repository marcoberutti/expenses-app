import { useState } from "react";

export const useMessage = () => {
  const [message, setMessage] = useState('');

  const setTemporaryMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage('');
    }, 4000);
  };

  return { message, setTemporaryMessage };
};
