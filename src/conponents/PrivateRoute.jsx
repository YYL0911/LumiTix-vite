import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { userRole, loading} = useAuth();

  if (loading) return (<div className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }}>
    <div className="spinner-border text-light" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>);

  // 沒有對應權限
  if (roles && !roles.includes(userRole)) {

    return <Navigate to="/" />;
    // return <Navigate to="/Unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
