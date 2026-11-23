
import { Navigate } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";

function ProtectedRoute({ children }) {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p>Verificando sesión...</p>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
