
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";

import { db } from "../firebase/config";
import Item from "./Item";

function ItemListContainer() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const productosPorPagina = 8;

  // Cargar productos desde Firestore
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const consulta = await getDocs(collection(db, "productos"));

        setProductos(
          consulta.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }))
        );
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setError("No se pudieron cargar los productos.");
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Buscar productos
  const textoBusqueda = busqueda.trim().toLowerCase();

  const productosFiltrados = productos.filter((producto) => {
    const nombre = (producto.nombre || "").toLowerCase();
    const descripcion = (producto.descripcion || "").toLowerCase();

    return (
      nombre.includes(textoBusqueda) ||
      descripcion.includes(textoBusqueda)
    );
  });

  // Calcular paginación
  const totalPaginas = Math.ceil(
    productosFiltrados.length / productosPorPagina
  );

  const inicio = (paginaActual - 1) * productosPorPagina;

  const productosPaginados = productosFiltrados.slice(
    inicio,
    inicio + productosPorPagina
  );

  // Cambiar búsqueda
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  if (cargando) return <p className="mensaje">Cargando productos...</p>;
  if (error) return <p className="mensaje error">{error}</p>;

  if (productos.length === 0) {
    return <p className="mensaje">No hay productos disponibles.</p>;
  }

  return (
    <section className="item-list-container">
      <h2>Nuestras bicicletas</h2>

      <div className="buscador-productos">
        <input
          type="text"
          placeholder="Buscar bicicletas o productos..."
          value={busqueda}
          onChange={handleBusqueda}
        />
      </div>

      {productosFiltrados.length === 0 ? (
        <p className="mensaje">
          No se encontraron productos para "{busqueda}".
        </p>
      ) : (
        <>
          <p className="resultados-productos">
            Productos encontrados: {productosFiltrados.length}
          </p>

          <div className="productos-grid">
            {productosPaginados.map((producto) => (
              <Item key={producto.id} producto={producto} />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacion">
              <button
                onClick={() => setPaginaActual(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                Anterior
              </button>

              {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                (numero) => (
                  <button
                    key={numero}
                    className={paginaActual === numero ? "pagina-activa" : ""}
                    onClick={() => setPaginaActual(numero)}
                  >
                    {numero}
                  </button>
                )
              )}

              <button
                onClick={() => setPaginaActual(paginaActual + 1)}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ItemListContainer;
