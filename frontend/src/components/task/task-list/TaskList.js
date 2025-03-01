import ImageTemplate from '../../../components/common/UI/ImageTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { tasksActions } from '../../../store/tasks-slice';
import useHttp from '../../../hooks/use-http';

const TaskList = () => {
  const dispatch = useDispatch();
  const { sendRequest: getTasks } = useHttp();
  const user = useSelector(state => state.userSlice.user);
  const taskList = useSelector(state => state.tasksSlice.tasks);

  useEffect(() => {
    const url = `${process.env.REACT_APP_DOMAIN_NAME}/tasks`;
    const requestConfigurations = {
      url,
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    const setTasksList = tasks => {
      if (tasks.length < 1) {
        window.location.href = '/new-task';
        return alert('No task found, create some task');
      }
      dispatch(tasksActions.setTasks(tasks));
    };
    getTasks(requestConfigurations, setTasksList).catch(error => {
      let errorMessage = error.message;
      if (
        errorMessage &&
        errorMessage.toLowerCase().includes('failed to fetch')
      )
        errorMessage = 'No network connection';
      return alert(errorMessage || 'Something went wrong');
    });
  }, [dispatch, getTasks, user]);

  const updateTaskHandler = (event, task) => {
    event.preventDefault();
    sessionStorage.setItem('task', JSON.stringify(task));
    window.location.href = `/update-task?taskId=${task['_id']}`;
  };

  const sendToDeleteTask = (event, task) => {
    sessionStorage.setItem('task', JSON.stringify(task));
    window.location.href = `/delete-task?taskId=${task['_id']}`;
  };

  if (taskList) {
    return taskList.map(task => (
      <div className="box-border" key={task['_id']}>
        <div className="box-content">
          <ImageTemplate profileImage={user ? user.user.userProfile : ''} />
          <form
            className="container-form validate-form"
            onSubmit={event => updateTaskHandler(event, task)}
          >
            <span className="title">To Do Task</span>
            <div
              className="container-text-input validate-input"
              data-validate="Description is required: Task Name"
            >
              <label htmlFor="task"></label>
              <input
                id="task"
                className="text-input"
                type="text"
                placeholder="Description"
                value={task.description}
                readOnly={true}
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
                value={task.completed}
                readOnly={true}
              />
              <span className="focus-text-input"></span>
              <span className="symbol-text-input">
                <i className="fa fa-amazon" aria-hidden="true"></i>
              </span>
            </div>
            <div className="container-button-input">
              <button className="submit-button" type="submit">
                Update
              </button>
            </div>
            <div className="text-center p-t-12"></div>
            <div className="text-center p-t-136">
              <button
                type="button"
                className="txt2"
                onClick={event => sendToDeleteTask(event, task)}
              >
                Delete Task
                <i
                  className="fa fa-long-arrow-right m-l-5"
                  aria-hidden="true"
                ></i>
              </button>
            </div>
          </form>
        </div>
      </div>
    ));
  }
};

export default TaskList;
