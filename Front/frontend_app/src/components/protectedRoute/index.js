import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Context from '../../authContext';

const ProtectedRoute = function () {
  const { store } = useContext(Context);

  if (!store?.isLogged) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
