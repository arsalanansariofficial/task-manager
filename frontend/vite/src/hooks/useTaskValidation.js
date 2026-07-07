import { useState } from 'react';

const useTaskValidation = (taskDescription, taskStatus) => {
  const [description, setDescription] = useState(taskDescription);
  const [status, setStatus] = useState(taskStatus);

  const descriptionChangeHandler = event => {
    const input = event.target.value;
    if (!input) {
      setDescription('');
      return event.target.parentNode.classList.add('alert-validate');
    }
    event.target.parentNode.classList.remove('alert-validate');
    setDescription(input);
  };

  const statusChangeHandler = event => {
    const input = event.target.value;
    setStatus(input);
  };

  const removeAlertHandler = event => {
    event.target.parentNode.classList.remove('alert-validate');
  };

  return {
    status,
    description,
    statusChangeHandler,
    descriptionChangeHandler,
    removeAlertHandler
  };
};

export default useTaskValidation;
