import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-contenido">

        <Link to="/" className="logo">
          Ruedaloca
        </Link>

        <div className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/productos">Productos</Link>
          <Link to="/carrito">Carrito</Link>
        </div>

      </div>
    </nav>
  );
}

export default NavBar;