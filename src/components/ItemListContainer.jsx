import { useEffect, useState } from "react";
import Item from "./Item";

function ItemListContainer() {

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {

    fetch("/productos.json")
      .then((respuesta) => respuesta.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al cargar productos:", error);
        setCargando(false);
      });

  }, []);

  if (cargando) {
    return <p className="mensaje">Cargando productos...</p>;
  }

  return (
    <section className="productos-container">

      <div className="titulo-seccion">
        <h2>Todos nuestros productos</h2>

        <p>
          Encontrá tecnología para todos tus proyectos.
        </p>
      </div>

      <div className="productos-grid">

        {productos.map((producto) => (
          <Item
            key={producto.id}
            producto={producto}
          />
        ))}

      </div>

    </section>
  );
}

export default ItemListContainer;