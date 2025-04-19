import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { userRole } = useAuth();

  // 沒有對應權限
  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/Unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
