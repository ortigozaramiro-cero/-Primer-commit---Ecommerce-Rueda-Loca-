import { Link } from "react-router-dom";

function Item({ producto }) {

  return (
    <article className="producto-card">

      <img
        src={producto.imagen}
        alt={producto.nombre}
      />

      <div className="producto-info">

        <span className="categoria">
          {producto.categoria}
        </span>

        <h3>{producto.nombre}</h3>

        <p className="precio">
          ${producto.precio.toLocaleString("es-AR")}
        </p>

        <Link
          to={`/producto/${producto.id}`}
          className="btn-detalle"
        >
          Ver detalle
        </Link>

      </div>

    </article>
  );
}

export default Item;