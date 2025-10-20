import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  return token ? children : <Navigate to="/rx78gpo1p6/login" replace />;
};

export default AdminProtectedRoute;
