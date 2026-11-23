
import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="home">
      <div className="home-contenido">
        <span className="home-etiqueta">Bicicletería</span>

        <h2>Bienvenido a Rueda Loca</h2>

        <p>
          Encontrá bicicletas a tu medida, accesorios,
          herramientas y mucho más.
        </p>

        <Link to="/productos" className="btn-principal">
          Ver productos
        </Link>
      </div>
    </section>
  );
}

export default Home;
