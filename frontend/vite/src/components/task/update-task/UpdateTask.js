import useTaskValidation from '../../../hooks/useTaskValidation';
import ImageTemplate from '../../common/UI/ImageTemplate';
import useHttp from '../../../hooks/use-http';
import { useSelector } from 'react-redux';

const UpdateTask = () => {
  const user = useSelector(state => state.userSlice.user);
  const { sendRequest: updateTask } = useHttp();
  const task = useSelector(state => state.taskSlice.task);
  const {
    description,
    descriptionChangeHandler,
    status,
    statusChangeHandler,
    removeAlertHandler
  } = useTaskValidation(task.description, task.completed.toString());
  const formIsValid = description;

  const updateTaskHandler = event => {
    event.preventDefault();
    if (formIsValid) {
      const url = `${process.env.REACT_APP_DOMAIN_NAME}/tasks/${task['_id']}`;
      const requestConfigurations = {
        url,
        method: 'PATCH',
        header: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: { description, completed: status.toLowerCase() === 'completed' }
      };
      const setTaskData = () => {
        alert('Task updated');
      };
      updateTask(requestConfigurations, setTaskData).catch(error => {
        let errorMessage = error.message;
        if (
          errorMessage &&
          errorMessage.toLowerCase().includes('failed to fetch')
        )
          errorMessage = 'No network connection';
        return alert(errorMessage || 'Something went wrong');
      });
    }
  };

  return (
    <>
      <ImageTemplate profileImage={user ? user.user.userProfile : ''} />
      <form
        className="container-form validate-form"
        onSubmit={updateTaskHandler}
      >
        <span className="title">To Do Task</span>
        <div
          className="container-text-input validate-input"
          data-validate="Description is required"
        >
          <label htmlFor="description"></label>
          <input
            id="description"
            className="text-input"
            type="text"
            placeholder="Description"
            value={description}
            onClick={removeAlertHandler}
            onChange={descriptionChangeHandler}
            autoFocus={true}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-pencil" aria-hidden="true"></i>
          </span>
        </div>
        <div className="container-text-input validate-input">
          <label htmlFor="status"></label>
          <input
            id="status"
            className="text-input"
            type="text"
            placeholder="Status"
            value={status}
            onChange={statusChangeHandler}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-amazon" aria-hidden="true"></i>
          </span>
        </div>
        <div className="container-button-input">
          <button
            className="submit-button"
            type="submit"
            disabled={!formIsValid}
          >
            Update Task
          </button>
        </div>
        <div className="text-center p-t-12"></div>
        <div className="text-center p-t-136"></div>
      </form>
    </>
  );
};

export default UpdateTask;
