const config = require('../config/app.config');

export const checkAvatarUrlData = (userData) => {
  if (userData === undefined || userData === null) {
    return 0;
  }
  if (!userData.Image.match(/^(https:\/\/)/)) {
    return `${config.apiURL}/users/${userData.User_ID}/avatar`;
  }
  return userData.Image;
};

export default checkAvatarUrlData;
