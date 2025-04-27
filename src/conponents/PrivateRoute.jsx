import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import Loading from './Loading';

const PrivateRoute = ({ roles }) => {
  const { userRole, loading} = useAuth();

  if (loading) return (<Loading></Loading>);

  // 沒有對應權限
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return <Outlet />; // 權限符合，渲染子頁面
};

export default PrivateRoute;
