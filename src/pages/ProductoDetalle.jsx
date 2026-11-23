
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { db } from "../firebase/config";
import useCarrito from "../context/hooks/useCarrito";

function ProductoDetalle() {
  const { id } = useParams();
  const { agregarAlCarrito } = useCarrito();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const respuesta = await getDoc(doc(db, "productos", id));

        setProducto(
          respuesta.exists()
            ? { id: respuesta.id, ...respuesta.data() }
            : null
        );
      } catch (error) {
        console.error("Error al obtener producto:", error);
        setProducto(null);
      } finally {
        setCargando(false);
      }
    };

    obtenerProducto();
  }, [id]);

  if (cargando) {
    return (
      <div className="mensaje">
        <h2>Cargando producto...</h2>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="mensaje">
        <h2>Producto no encontrado</h2>
        <Link to="/productos" className="btn-principal">
          Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <main className="detalle-producto">
      <div className="detalle-producto-imagen">
        <img src={producto.imagen} alt={producto.nombre} />
      </div>

      <div className="detalle-producto-info">
        <span className="detalle-etiqueta">
          RUEDA LOCA - BICICLETERÍA
        </span>

        <h2>{producto.nombre}</h2>
        <p className="detalle-producto-descripcion">
          {producto.descripcion}
        </p>
        <p className="detalle-producto-precio">${producto.precio}</p>

        <button
          className="btn-principal"
          onClick={() => agregarAlCarrito(producto)}
        >
          Agregar al carrito
        </button>

        <Link to="/productos" className="volver">
          ← Volver a productos
        </Link>
      </div>
    </main>
  );
}

export default ProductoDetalle;

