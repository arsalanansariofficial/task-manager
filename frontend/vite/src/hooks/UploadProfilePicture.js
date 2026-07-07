export const uploadUserProfilePicture = async (user, profilePicture) => {
  const formData = new FormData();
  formData.append('uploadProfile', profilePicture);
  const url = `${process.env.REACT_APP_DOMAIN_NAME}/users/upload-profile-picture`;
  const imageRequestConfigurations = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${user.token}`
    },
    body: formData
  };
  return await fetch(url, imageRequestConfigurations);
};
