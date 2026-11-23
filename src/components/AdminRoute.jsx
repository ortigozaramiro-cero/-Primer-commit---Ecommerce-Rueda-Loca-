
import { Navigate } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";

function AdminRoute({ children }) {
  const { usuario, rol, cargando } = useAuth();

  if (cargando) {
    return <p>Verificando permisos...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (rol !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
