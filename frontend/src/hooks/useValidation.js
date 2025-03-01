import { useState } from 'react';

const useValidation = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const emailChangeHandler = event => {
    const input = event.target.value;
    if (!input) {
      setEmail(null);
      return event.target.parentNode.classList.add('alert-validate');
    }
    event.target.parentNode.classList.remove('alert-validate');
    setEmail(input);
  };

  const passwordChangeHandler = event => {
    const input = event.target.value;
    if (!input) {
      setPassword(null);
      return event.target.parentNode.classList.add('alert-validate');
    }
    event.target.parentNode.classList.remove('alert-validate');
    setPassword(input);
  };

  const removeAlertHandler = event => {
    event.target.parentNode.classList.remove('alert-validate');
  };

  return {
    email,
    password,
    emailChangeHandler,
    passwordChangeHandler,
    removeAlertHandler
  };
};

export default useValidation;
