import ImageTemplate from '../../common/UI/ImageTemplate';
import useTaskValidation from '../../../hooks/useTaskValidation';
import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../../../hooks/use-http';
import { taskActions } from '../../../store/task-slice';

const NewTask = () => {
  const dispatch = useDispatch();
  const { sendRequest: addTask } = useHttp();
  const user = useSelector(state => state.userSlice.user);
  const { description, descriptionChangeHandler, removeAlertHandler } =
    useTaskValidation();
  const formIsValid = description;

  const addTaskHandler = event => {
    event.preventDefault();
    if (formIsValid) {
      const url = `${process.env.REACT_APP_DOMAIN_NAME}/tasks`;
      const requestConfigurations = {
        url,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: { description }
      };
      const setTaskData = task => {
        alert('Task created');
        dispatch(taskActions.setTask(task));
      };
      addTask(requestConfigurations, setTaskData).catch(error => {
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
      <form className="container-form validate-form" onSubmit={addTaskHandler}>
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
            onClick={removeAlertHandler}
            onChange={descriptionChangeHandler}
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
            Add Task
          </button>
        </div>
        <div className="text-center p-t-12"></div>
        <div className="text-center p-t-136"></div>
      </form>
    </>
  );
};

export default NewTask;
