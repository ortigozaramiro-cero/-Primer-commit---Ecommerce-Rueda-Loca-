
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function DetalleProducto() {

  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    fetch("/productos.json")
      .then((respuesta) => respuesta.json())
      .then((data) => {

        const productoEncontrado = data.find(
          (producto) => producto.id === Number(id)
        );

        setProducto(productoEncontrado);
        setCargando(false);

      })
      .catch((error) => {
        console.error("Error:", error);
        setCargando(false);
      });

  }, [id]);

  if (cargando) {
    return <p className="mensaje">Cargando producto...</p>;
  }

  if (!producto) {
    return (
      <section className="mensaje">
        <h2>Producto no encontrado</h2>

        <Link to="/productos" className="btn-principal">
          Volver a productos
        </Link>
      </section>
    );
  }

  return (
    <section className="detalle">

      <div className="detalle-imagen">
        <img
          src={producto.imagen}
          alt={producto.nombre}
        />
      </div>

      <div className="detalle-info">

        <span className="categoria">
          {producto.categoria}
        </span>

        <h2>{producto.nombre}</h2>

        <p className="detalle-descripcion">
          {producto.descripcion}
        </p>

        <p className="precio detalle-precio">
          ${producto.precio.toLocaleString("es-AR")}
        </p>

        <button className="btn-principal">
          Agregar al carrito
        </button>

        <Link
          to="/productos"
          className="volver"
        >
          ← Volver a productos
        </Link>

      </div>

    </section>
  );
}

export default DetalleProducto;