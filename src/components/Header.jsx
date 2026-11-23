
import { Link } from "react-router-dom";
import useCarrito from "../context/hooks/useCarrito";
import useAuth from "../context/hooks/useAuth";

function Header() {
  const { cantidadTotal } = useCarrito();
  const { usuario, rol, cerrarSesion } = useAuth();

  const handleCerrarSesion = async () => {
    try {
      await cerrarSesion();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        <h1>Rueda Loca</h1>
      </Link>

      <nav className="header-nav">
        <Link to="/">Inicio</Link>
        <Link to="/productos">Productos</Link>

        {usuario ? (
          <>
            <Link to="/perfil">Mi perfil</Link>
            <Link to="/mis-pedidos">Mis pedidos</Link>

            {rol === "admin" && (
              <Link to="/admin">Administrar</Link>
            )}

            <span className="usuario-saludo">
              Hola, {usuario.email}
            </span>

            <button onClick={handleCerrarSesion}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/registro">Registrarse</Link>
          </>
        )}

        <Link to="/carrito" className="carrito-icono">
          🛒
          <span className="contador-carrito">
            {cantidadTotal}
          </span>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
