
import { Link } from "react-router-dom";
import useCarrito from "../context/hooks/useCarrito";

function Item({ producto }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <article className="producto-card">
      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <div className="producto-info">
        <h3>{producto.nombre}</h3>

        <p className="producto-descripcion">
          {producto.descripcion}
        </p>

        <p className="precio">
          ${producto.precio}
        </p>

        <div className="producto-acciones">
          <Link
            to={`/producto/${producto.id}`}
            className="btn-detalle"
          >
            Ver detalle
          </Link>

          <button
            className="btn-agregar"
            onClick={() => agregarAlCarrito(producto)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}

export default Item;
