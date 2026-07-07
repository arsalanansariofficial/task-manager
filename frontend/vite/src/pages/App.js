import { Route, Switch } from 'react-router-dom';
import Layout from '../components/common/UI/Layout';
import LoginPage from './user/login-page/LoginPage';
import SignUpPage from './user/signup-page/SignUpPage';
import NewTaskPage from './task/new-task-page/NewTaskPage';
import TaskListPage from './task/tasks-list-page/TaskListPage';
import { useSelector } from 'react-redux';
import DeleteTaskPage from './task/delete-task-page/DeleteTaskPage';
import UpdateTaskPage from './task/update-task-page/UpdateTaskPage';
import DashboardPage from './user/dashboard-page/DashboardPage';
import Dashboard from '../components/user/dashboard/Dashboard';

const App = () => {
  const user = useSelector(state => state.userSlice.user);
  return (
    <Switch>
      {!user && (
        <Route path="/" exact={true}>
          <Layout>
            <LoginPage />
          </Layout>
        </Route>
      )}
      {!user && (
        <Route path="/signup" exact={true}>
          <Layout>
            <SignUpPage />
          </Layout>
        </Route>
      )}
      {user && (
        <Route path="/dashboard" exact={true}>
          <Layout>
            <DashboardPage />
          </Layout>
        </Route>
      )}
      {user && (
        <Route path="/new-task" exact={true}>
          <Layout>
            <NewTaskPage />
          </Layout>
        </Route>
      )}
      {user && (
        <Route path="/update-task" exact={true}>
          <Layout>
            <UpdateTaskPage />
          </Layout>
        </Route>
      )}
      {user && (
        <Route path="/delete-task" exact={true}>
          <Layout>
            <DeleteTaskPage />
          </Layout>
        </Route>
      )}
      {user && (
        <Route path="/all-task" exact={true}>
          <TaskListPage />
        </Route>
      )}
      <Route path="/*" exact={true}>
        {!user && (
          <Layout>
            <LoginPage />
          </Layout>
        )}
        {user && (
          <Layout>
            <Dashboard />
          </Layout>
        )}
      </Route>
    </Switch>
  );
};

export default App;
