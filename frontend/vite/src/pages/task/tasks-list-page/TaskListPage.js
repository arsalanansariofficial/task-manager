import TaskList from '../../../components/task/task-list/TaskList';
import Header from '../../../components/common/header/Header';

const TaskListPage = () => {
  return (
    <>
      <Header />
      <div className="box-main">
        <TaskList />
      </div>
    </>
  );
};

export default TaskListPage;
