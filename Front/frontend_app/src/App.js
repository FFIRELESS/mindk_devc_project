import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { observer } from 'mobx-react-lite';
import AuthContainer from './containers/auth';
import ErrorBoundary from './components/ErrorBoundary';
import PostsContainer from './containers/post';
import EditPostFormContainer from './containers/post/editPostForm';
import UsersContainer from './containers/users';
import UserProfileContainer from './containers/userProfile';
import EditProfileContainer from './containers/userProfile/editProfileForm';
import NotFound from './components/errors/notFound';
import Context from './authContext';
import ProtectedRoute from './components/protectedRoute';
import GuestRoute from './components/guestRoute';

const queryClient = new QueryClient();

const App = function () {
  const { store } = useContext(Context);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth().then(() => {});
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<PostsContainer />} />
              <Route path="/posts/:id/edit" element={<EditPostFormContainer />} />
              <Route path="/users/:id/edit" element={<EditProfileContainer />} />
            </Route>
            <Route element={<GuestRoute />}>
              <Route path="/login" element={<AuthContainer />} />
            </Route>
            <Route path="/posts" element={<PostsContainer />} />
            <Route path="/users" element={<UsersContainer />} />
            <Route path="/users/:id" element={<UserProfileContainer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default observer(App);
