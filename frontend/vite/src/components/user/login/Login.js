import defaultProfilePicture from '../../../assets/default-profile-picture.png';
import ImageTemplate from '../../common/UI/ImageTemplate';
import useValidation from '../../../hooks/useValidation';
import useHttp from '../../../hooks/use-http';
import useAuthentication from '../../../hooks/use-authentication';

const Login = () => {
  const { sendRequest: loginUser } = useHttp();
  const { loginHandler } = useAuthentication();
  const {
    email,
    password,
    emailChangeHandler,
    passwordChangeHandler,
    removeAlertHandler
  } = useValidation();
  const formIsValid = email && password;

  const loginClickHandler = event => {
    event.preventDefault();
    const emailRegex =
      /^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(]?)$/;
    let isValidInput = true;
    if (!email || !emailRegex.test(email.toString())) {
      isValidInput = false;
      event.target.childNodes[1].classList.add('alert-validate');
    }
    if (!password || password.length < 7) {
      event.target.childNodes[2].classList.add('alert-validate');
      isValidInput = false;
    }
    if (isValidInput) {
      const url = `${process.env.REACT_APP_DOMAIN_NAME}/users/login`;
      const requestConfigurations = {
        url,
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        body: { email, password }
      };
      const setUserData = async user => {
        user.user.userProfile = `${process.env.REACT_APP_DOMAIN_NAME}/${user.user.profilePicture}`;
        loginHandler(user);
        window.location.href = '/dashboard';
      };
      loginUser(requestConfigurations, setUserData).catch(error => {
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
      <ImageTemplate profileImage={defaultProfilePicture} />
      <form
        className="container-form validate-form"
        onSubmit={loginClickHandler}
      >
        <span className="title">Login</span>
        <div
          className="container-text-input validate-input"
          data-validate="Valid email is required: ex@abc.xyz"
        >
          <label htmlFor="email"></label>
          <input
            id="email"
            className="text-input"
            type="text"
            placeholder="Email"
            onClick={removeAlertHandler}
            onChange={emailChangeHandler}
            autoFocus={true}
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
            Login
          </button>
        </div>
        <div className="text-center p-t-12">
          <span className="txt1">Forgot</span>
          <a className="txt2" href="/">
            Username / Password ?
          </a>
        </div>
        <div className="text-center p-t-136">
          <a className="txt2" href="/signup">
            Create your Account
            <i className="fa fa-long-arrow-right m-l-5" aria-hidden="true"></i>
          </a>
        </div>
      </form>
    </>
  );
};

export default Login;
