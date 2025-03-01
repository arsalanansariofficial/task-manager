import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user-slice';

const calculateExpirationTime = expirationDate => {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expirationDate).getTime();
  return expirationTime - currentTime;
};

const setExpirationDate = () =>
  new Date(new Date().getTime() + 60 * 60 * 1000).toISOString();

let logoutTimer;

const useAuthentication = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(sessionStorage.getItem('user') || null);

  const loginHandler = user => {
    user.expirationDate = setExpirationDate();
    sessionStorage.setItem('user', JSON.stringify(user));
    dispatch(userActions.login(user));
    const expirationTime = calculateExpirationTime(user.expirationDate);
    logoutTimer = setTimeout(logoutHandler, expirationTime);
  };

  const logoutHandler = useCallback(() => {
    clearTimeout(logoutTimer);
    dispatch(userActions.logout());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const expirationTime = calculateExpirationTime(user.expirationDate);
      logoutTimer = setTimeout(logoutHandler, expirationTime);
    }
  }, [user, logoutHandler, dispatch]);

  return { loginHandler, logoutHandler };
};

export default useAuthentication;
