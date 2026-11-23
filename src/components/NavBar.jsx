
import { Link } from "react-router-dom";
import useAuth from "../context/hooks/useAuth";

function NavBar() {
  const { usuario } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-contenido">

        <Link to="/" className="logo">
          Rueda Loca
        </Link>

        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/carrito">Carrito</Link>

          {usuario ? (
            <>
              <Link to="/perfil">Mi perfil</Link>
              <Link to="/mis-pedidos">Mis pedidos</Link>
            </>
          ) : (
            <>
              <Link to="/login">Iniciar sesión</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}

export default NavBar;
