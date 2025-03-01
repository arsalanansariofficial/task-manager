import { useState } from 'react';
import defaultBackgroundImage from '../../../assets/default-profile-picture.png';
import useValidation from '../../../hooks/useValidation';
import useHttp from '../../../hooks/use-http';
import useAuthentication from '../../../hooks/use-authentication';
import { uploadUserProfilePicture } from '../../../hooks/UploadProfilePicture';

const SignUp = () => {
  const { sendRequest: signupUser } = useHttp();
  const { loginHandler } = useAuthentication();
  const backgroundImage = `url(${defaultBackgroundImage})`;
  const {
    email,
    password,
    emailChangeHandler,
    passwordChangeHandler,
    removeAlertHandler
  } = useValidation();
  const [name, setName] = useState(null);
  const [profilePicture, setProfilePicture] = useState();
  const formIsValid = name && email && password;

  const nameChangeHandler = event => {
    const input = event.target.value;
    if (!input) {
      setName(null);
      return event.target.parentNode.classList.add('alert-validate');
    }
    event.target.parentNode.classList.remove('alert-validate');
    setName(input);
  };

  const changeProfileImageHandler = event => {
    const pictureTemplate =
      event.target.parentNode.parentNode.lastElementChild.lastElementChild;
    const imageAsDataURL = new FileReader();
    imageAsDataURL.onload = input => {
      pictureTemplate.style.backgroundImage = `url(${input.target.result})`;
      pictureTemplate.style.transition = 'all 2s ease-in-out';
    };
    imageAsDataURL.readAsDataURL(event.target.files[0]);
    setProfilePicture(event.target.files[0]);
  };

  const createAccountHandler = event => {
    event.preventDefault();
    const emailRegex =
      /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(]?)$/;
    let isValidInput = true;
    if (!email || !emailRegex.test(email.toString())) {
      isValidInput = false;
      event.target.childNodes[2].classList.add('alert-validate');
    }
    if (!password || password.length < 7) {
      event.target.childNodes[3].classList.add('alert-validate');
      isValidInput = false;
    }
    if (isValidInput) {
      const url = `${process.env.REACT_APP_DOMAIN_NAME}/users`;
      const requestConfigurations = {
        url,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        body: {
          name,
          email,
          password
        }
      };
      const setUserData = async user => {
        user.user.userProfile = `${process.env.REACT_APP_DOMAIN_NAME}/${user.user.profilePicture}`;
        uploadUserProfilePicture(user, profilePicture)
          .then(() => {
            loginHandler(user);
            window.location.href = '/dashboard';
          })
          .catch(() => {
            loginHandler(user);
            window.location.href = '/dashboard';
          });
      };
      signupUser(requestConfigurations, setUserData).catch(error => {
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
            <div className="profile-preview">
              <div id="imagePreview" style={{ backgroundImage }}></div>
            </div>
          </div>
        </div>
      </div>
      <form
        className="container-form validate-form"
        onSubmit={createAccountHandler}
      >
        <span className="title">Sign Up</span>
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
            onClick={removeAlertHandler}
            onChange={emailChangeHandler}
          />
          <span className="focus-text-input"></span>
          <span className="symbol-text-input">
            <i className="fa fa-envelope" aria-hidden="true"></i>
          </span>
        </div>
        <div
          className="container-text-input validate-input"
          data-validate="Password is required"
        >
          <label htmlFor="password"></label>
          <input
            id="password"
            className="text-input"
            type="password"
            placeholder="Password"
            onClick={removeAlertHandler}
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
            Create Account
          </button>
        </div>
        <div className="text-center p-t-12"></div>
        <div className="text-center p-t-136"></div>
      </form>
    </>
  );
};

export default SignUp;
