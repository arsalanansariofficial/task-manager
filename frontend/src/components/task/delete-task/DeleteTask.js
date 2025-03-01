import ImageTemplate from '../../common/UI/ImageTemplate';
import { useSelector } from 'react-redux';
import useHttp from '../../../hooks/use-http';

const DeleteTask = () => {
  const user = useSelector(state => state.userSlice.user);
  const { sendRequest: deleteTask } = useHttp();
  const task = useSelector(state => state.taskSlice.task);

  const deleteTaskHandler = event => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_DOMAIN_NAME}/tasks/${task['_id']}`;
    const requestConfigurations = {
      url,
      method: 'DELETE',
      header: {
        Authorization: `Bearer ${user.token}`
      }
    };
    const setTaskData = () => {
      alert('Task deleted');
    };
    deleteTask(requestConfigurations, setTaskData).catch(error => {
      let errorMessage = error.message;
      if (
        errorMessage &&
        errorMessage.toLowerCase().includes('failed to fetch')
      )
        errorMessage = 'No network connection';
      return alert(errorMessage || 'Something went wrong');
    });
  };

  if (task) {
    return (
      <>
        <ImageTemplate profileImage={user ? user.user.userProfile : ''} />
        <form
          className="container-form validate-form"
          onSubmit={deleteTaskHandler}
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
              value={task.description}
              readOnly={true}
            />
            <span className="focus-text-input"></span>
            <span className="symbol-text-input">
              <i className="fa fa-amazon" aria-hidden="true"></i>
            </span>
          </div>
          <div className="container-button-input">
            <button className="submit-button" type="submit">
              Delete Task
            </button>
          </div>
          <div className="text-center p-t-12"></div>
          <div className="text-center p-t-136"></div>
        </form>
      </>
    );
  }
};

export default DeleteTask;
