import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
