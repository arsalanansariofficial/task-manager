import { useState } from 'react';
import useValidation from '../../../hooks/useValidation';
import useHttp from '../../../hooks/use-http';
import { uploadUserProfilePicture } from '../../../hooks/UploadProfilePicture';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../../../store/user-slice';
import useAuthentication from '../../../hooks/use-authentication';

const calculateExpirationTime = expirationDate => {
  const currentTime = new Date().getTime();
  const expirationTime = new Date(expirationDate).getTime();
  return expirationTime - currentTime;
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const { sendRequest: updateUserProfile } = useHttp();
  const { sendRequest: deleteUserAccount } = useHttp();
  const { logoutHandler } = useAuthentication();
  const user = useSelector(state => state.userSlice.user);
  const { removeAlertHandler } = useValidation();
  const [name, setName] = useState(user.user.name.toString());
  const [email, setEmail] = useState(user.user.email.toString());
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(
    user ? user.user.userProfile : ''
  );
  const [newProfilePicture, setNewProfilePicture] = useState();
  const formIsValid = name && email;

  const nameChangeHandler = event => {
    const input = event.target.value;
    if (!input) {
      setName(null);
      return event.target.parentNode.classList.add('alert-validate');
    }
    event.target.parentNode.classList.remove('alert-validate');
    setName(input);
  };

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
    if (!input) return setPassword(null);
    setPassword(input);
  };

  const changeProfileImageHandler = event => {
    const imageAsDataURL = new FileReader();
    imageAsDataURL.onload = input => {
      setProfilePicture(input.target.result);
    };
    imageAsDataURL.readAsDataURL(event.target.files[0]);
    setNewProfilePicture(event.target.files[0]);
  };

  const storeUpdatedUser = updatedUser => {
    const expirationTime = calculateExpirationTime(user.expirationDate);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch(userActions.login(updatedUser));
    setTimeout(() => {
      dispatch(userActions.logout(updatedUser));
    }, expirationTime);
  };

  const updateAccountHandler = event => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_DOMAIN_NAME}/users/update-profile`;
    let body = {};
    if (name) body.name = name;
    if (email) body.email = email;
    if (password) body.password = password;
    const requestConfigurations = {
      url,
      method: 'PATCH',
      header: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body
    };
    const setUserData = async userData => {
      const updatedUser = {
        user: { ...userData },
        expirationDate: user.expirationDate,
        token: user.token
      };
      updatedUser.user.userProfile = `${process.env.REACT_APP_DOMAIN_NAME}/${user.user.profilePicture}`;
      storeUpdatedUser(updatedUser);
      if (newProfilePicture)
        uploadUserProfilePicture(user, newProfilePicture)
          .then(() => {
            window.location.href = '/dashboard';
          })
          .catch(() => {
            window.location.href = '/dashboard';
          });
    };
    updateUserProfile(requestConfigurations, setUserData).catch(error => {
      let errorMessage = error.message;
      if (
        errorMessage &&
        errorMessage.toLowerCase().includes('failed to fetch')
      )
        errorMessage = 'No network connection';
      return alert(errorMessage || 'Something went wrong');
    });
  };

  const deleteAccountHandler = () => {
    const url = `${process.env.REACT_APP_DOMAIN_NAME}/users/delete-profile`;
    const requestConfigurations = {
      url,
      header: {
        Authorization: `Bearer ${user.token}`
      },
      method: 'DELETE'
    };
    deleteUserAccount(requestConfigurations, logoutHandler).catch(error => {
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
    <>
      <div className="container-image js-tilt" data-tilt={true}>
        <div className="container">
          <div className="profile-upload">
            <div className="profile-edit">
              <input
                type="file"
                id="imageUpload"
                accept=".png, .jpg, .jpeg"
                onChange={changeProfileImageHandler}
              />
              <label htmlFor="imageUpload"></label>
            </div>
            <img id="imagePreview" src={profilePicture} alt="" />
          </div>
        </div>
      </div>
      <form
        className="container-form validate-form"
        onSubmit={updateAccountHandler}
      >
        <span className="title">Welcome, {user.user.name}</span>
        <div
          className="container-text-input validate-input"
          data-validate="Name is required: Task Name"
        >
          <label htmlFor="name"></label>
          <input
            id="name"
            className="text-input"
            type="text"
            placeholder="Name"
            value={name}
            onClick={removeAlertHandler}
            onChange={nameChangeHandler}
            autoFocus={true}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-user" aria-hidden="true"></i>
          </span>
        </div>
        <div
          className="container-text-input validate-input"
          data-validate="Email is required: example@example.com"
        >
          <label htmlFor="email"></label>
          <input
            id="email"
            className="text-input"
            type="email"
            placeholder="Email"
            value={email}
            onClick={removeAlertHandler}
            onChange={emailChangeHandler}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </span>
        </div>
        <div className="container-text-input">
          <label htmlFor="password"></label>
          <input
            id="password"
            className="text-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={passwordChangeHandler}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-lock" aria-hidden="true"></i>
          </span>
        </div>
        <div className="container-button-input">
          <button
            className="submit-button"
            type="submit"
            disabled={!formIsValid}
          >
            Update Profile
          </button>
        </div>
        <div className="text-center p-t-12"></div>
        <div className="text-center p-t-136">
          <button type="button" className="txt3" onClick={deleteAccountHandler}>
            Delete Account
            <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
          </button>
        </div>
      </form>
    </>
  );
};

export default Dashboard;
