import React from 'react';

import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import UserProfile from '../../components/userProfile';
import { getUser } from '../users/api/crud';
import ResponsiveAppBar from '../../components/header/navbar';
import NotFound from '../../components/errors/notFound';
import UserFriendsContainer from '../friends';
import CircleLoader from '../../components/header/circleLoader';

// import AuthContext from '../../authContext';

const UserProfileContainer = function () {
  const { id } = useParams();

  // const [userData, setUserData] = useState({
  // isLogged: false,
  // user: { id: 2, username: 'username' }
  // });
  // setUserData({ isLogged: true, user: { id: 3, username: 'default' } });

  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  if (!id.match(/^\d+$/)) {
    return <NotFound />;
  }

  const { isFetching, data } = useQuery('user', () => getUser(id));
  const user = data?.data;

  if (user === undefined || user.length === 0) {
    return <NotFound />;
  }
  return (
  // <AuthContext.Provider value={userData}>
    <>
      <ResponsiveAppBar />
      <Offset />
      {isFetching && <CircleLoader />}
      <Box
        marginTop={3}
        marginBottom={-3}
        marginLeft={3}
        marginRight={3}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          sx={{ width: '80vh', maxWidth: 620 }}
        >
          <h1>Profile</h1>
        </Box>
      </Box>
      <UserProfile user={user} />
      <UserFriendsContainer />
    </>
  // </AuthContext.Provider>
  );
};

export default UserProfileContainer;
