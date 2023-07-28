import { Outlet, Navigate } from "react-router-dom";
import useStateContext from "../../hooks/useStateContext";

const ProtectedRoute = ({ allowedRoles, ...props }) => {
  const { context } = useStateContext();
  let auth = { token: false };

  if (allowedRoles.includes(context.role) || context.isCustomer) {
    auth.token = true;
  }

  return auth.token ? <Outlet {...props} /> : <Navigate to="/account" />;
};

const CustomerProtectedRoute = (props) => {
  return <ProtectedRoute allowedRoles={[]} {...props} />;
};

export { ProtectedRoute, CustomerProtectedRoute };
