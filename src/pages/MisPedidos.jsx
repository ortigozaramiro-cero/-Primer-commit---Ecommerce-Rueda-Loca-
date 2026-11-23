
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";

import useAuth from "../context/hooks/useAuth";
import { db } from "../firebase/config";

function MisPedidos() {
  const { usuario } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPedidos = async () => {
      if (!usuario) {
        setCargando(false);
        return;
      }

      try {
        setCargando(true);
        setError("");

        const consulta = query(
          collection(db, "pedidos"),
          where("usuarioId", "==", usuario.uid)
        );

        const respuesta = await getDocs(consulta);

        const lista = respuesta.docs.map((documento) => ({
          id: documento.id,
          ...documento.data()
        }));

        lista.sort(
          (a, b) => (b.fecha?.toMillis?.() || 0) - (a.fecha?.toMillis?.() || 0)
        );

        setPedidos(lista);
      } catch (error) {
        console.error("Error al obtener pedidos:", error);
        setError("No se pudieron cargar tus pedidos.");
      } finally {
        setCargando(false);
      }
    };

    obtenerPedidos();
  }, [usuario]);

  if (cargando) {
    return (
      <div className="pedidos-mensaje">
        <h2>Cargando tus pedidos...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-mensaje">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <main className="mis-pedidos">
      <div className="pedidos-encabezado">
        <span>RUEDA LOCA</span>
        <h2>Historial de compras</h2>
        <p>Consultá todos tus pedidos realizados.</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="pedidos-vacio">
          <span className="pedidos-icono">🛒</span>
          <h3>Todavía no realizaste ninguna compra</h3>
          <p>Cuando realices un pedido, aparecerá en esta sección.</p>
          <Link to="/productos" className="btn-principal">
            Explorar productos
          </Link>
        </div>
      ) : (
        <>
          <div className="pedidos-resumen">
            <p>
              Compras realizadas: <strong>{pedidos.length}</strong>
            </p>
          </div>

          <div className="pedidos-lista">
            {pedidos.map((pedido) => (
              <article key={pedido.id} className="pedido-card">
                <div className="pedido-encabezado">
                  <div>
                    <span className="pedido-etiqueta">Número de pedido</span>
                    <h3>{pedido.id}</h3>
                  </div>
                  <span className="pedido-estado">
                    {pedido.estado || "Pendiente"}
                  </span>
                </div>

                <div className="pedido-fecha">
                  <strong>Fecha de compra:</strong>{" "}
                  {pedido.fecha?.toDate
                    ? pedido.fecha.toDate().toLocaleString("es-AR")
                    : "Fecha no disponible"}
                </div>

                <div className="pedido-productos">
                  <h4>Productos comprados</h4>

                  {pedido.productos?.length > 0 ? (
                    pedido.productos.map((producto, indice) => (
                      <div
                        className="pedido-producto"
                        key={`${producto.id || producto.nombre}-${indice}`}
                      >
                        {producto.imagen && (
                          <img
                            src={producto.imagen}
                            alt={producto.nombre || "Producto"}
                          />
                        )}

                        <div className="pedido-producto-info">
                          <h5>{producto.nombre}</h5>
                          <p>Cantidad: {producto.cantidad}</p>
                          <p>Precio unitario: ${producto.precio}</p>
                        </div>

                        <strong className="pedido-producto-subtotal">
                          ${producto.precio * producto.cantidad}
                        </strong>
                      </div>
                    ))
                  ) : (
                    <p>No hay productos registrados en este pedido.</p>
                  )}
                </div>

                <div className="pedido-total">
                  <span>Total de la compra</span>
                  <strong>${pedido.total}</strong>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default MisPedidos;
