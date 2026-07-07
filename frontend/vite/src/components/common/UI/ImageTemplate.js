const ImageTemplate = ({ profileImage }) => {
  return (
    <div className="container-image js-tilt" data-tilt={true}>
      <img id="user-profile" src={profileImage} alt="User Profile" />
    </div>
  );
};

export default ImageTemplate;
