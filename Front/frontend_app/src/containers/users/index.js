import React, { useContext } from 'react';

import { useQuery } from 'react-query';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { getUsers } from './api/crud';
import Users from '../../components/users';
import ResponsiveAppBar from '../../components/header/navbar';
import CircleLoader from '../../components/header/circleLoader';
import Context from '../../authContext';

const UsersContainer = function () {
  const { store } = useContext(Context);

  const { isFetching, data } = useQuery('users', () => getUsers());
  const users = data?.data || [];
  const Offset = styled('div')(({ theme }) => theme.mixins.toolbar);

  return (
    <>
      <ResponsiveAppBar />
      <Offset />
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
          <h1>Users</h1>
          {store.user.role === 'admin' && (
            <Box marginTop={-3}>
              <h3 style={{ color: 'red' }}>ADMIN MODE</h3>
            </Box>
          )}
        </Box>
      </Box>
      {isFetching && <CircleLoader />}
      {users.map((user) => <div key={user.User_ID}><Users user={user} /></div>)}
    </>
  );
};

export default UsersContainer;
