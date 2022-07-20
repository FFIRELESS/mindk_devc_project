import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Context from '../../authContext';

const GuestRoute = function () {
  const { store } = useContext(Context);

  if (store?.isLogged) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default GuestRoute;
