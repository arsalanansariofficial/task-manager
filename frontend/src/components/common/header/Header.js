import defaultProfilePicture from '../../../assets/user.png';
import useHttp from '../../../hooks/use-http';
import useAuthentication from '../../../hooks/use-authentication';
import { useSelector } from 'react-redux';

const Header = () => {
  const { sendRequest: logoutUserHandler } = useHttp();
  const { logoutHandler } = useAuthentication();
  const user = useSelector(state => state.userSlice.user);
  let profilePicture = user ? user.user.userProfile : defaultProfilePicture;

  const addTaskHandler = () => {
    window.location.href = '/new-task';
  };

  const viewTasksHandler = () => {
    window.location.href = '/all-task';
  };

  const profileClickHandler = () => {
    if (user) return (window.location.href = '/dashboard');
    return (window.location.href = '/');
  };

  const logoutUser = () => {
    const url = `${process.env.REACT_APP_DOMAIN_NAME}/users/logout`;
    const requestConfigurations = {
      url,
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    };
    const onLogout = () => {
      logoutHandler();
    };
    logoutUserHandler(requestConfigurations, onLogout).catch(error => {
      let errorMessage = error.message;
      if (
        errorMessage &&
        errorMessage.toLowerCase().includes('failed to fetch')
      )
        errorMessage = 'No network connection';
      return alert(errorMessage || 'Something went wrong');
    });
  };

  return (
    <div className="header-container">
      <ul>
        {user && (
          <li>
            <button className="navigation-button" onClick={addTaskHandler}>
              Add Task
            </button>
          </li>
        )}
        {user && (
          <li>
            <button className="navigation-button" onClick={viewTasksHandler}>
              View Tasks
            </button>
          </li>
        )}
        <li style={{ float: 'right' }}>
          <img
            src={profilePicture}
            alt="User Profile"
            onClick={profileClickHandler}
          />
        </li>
        {user && (
          <li style={{ float: 'right' }}>
            <button className="navigation-button active" onClick={logoutUser}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Header;
