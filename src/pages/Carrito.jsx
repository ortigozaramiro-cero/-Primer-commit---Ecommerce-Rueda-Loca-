

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  serverTimestamp
} from "firebase/firestore";

import useCarrito from "../context/hooks/useCarrito";
import useAuth from "../context/hooks/useAuth";
import { db } from "../firebase/config";

function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    cambiarCantidad,
    vaciarCarrito,
    total
  } = useCarrito();

  const { usuario } = useAuth();

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [compraExitosa, setCompraExitosa] = useState(false);

  // Registrar compra en Firestore
  const finalizarCompra = async () => {
    if (!usuario) {
      setError("Tenés que iniciar sesión para realizar una compra.");
      return;
    }

    if (carrito.length === 0) {
      setError("Tu carrito está vacío.");
      return;
    }

    try {
      setCargando(true);
      setError("");

      const pedido = {
        usuarioId: usuario.uid,
        email: usuario.email,
        productos: carrito.map(({ id, nombre, precio, cantidad, imagen }) => ({
          id,
          nombre,
          precio: Number(precio),
          cantidad: Number(cantidad),
          imagen: imagen || ""
        })),
        total: Number(total),
        estado: "pendiente",
        fecha: serverTimestamp()
      };

      await addDoc(collection(db, "pedidos"), pedido);

      vaciarCarrito();
      setCompraExitosa(true);

    } catch (error) {
      console.error("Error al guardar el pedido:", error);
      setError("No se pudo registrar tu compra. Intentá nuevamente.");
    } finally {
      setCargando(false);
    }
  };

  // Confirmación de compra
  if (compraExitosa) {
    return (
      <main className="carrito-exito">
        <div className="carrito-exito-contenido">
          <span className="carrito-exito-icono">✓</span>
          <h2>¡Compra realizada!</h2>
          <p>Tu pedido fue registrado correctamente.</p>
          <p>Gracias por comprar en Rueda Loca.</p>

          <Link to="/productos" className="btn-principal">
            Seguir comprando
          </Link>
        </div>
      </main>
    );
  }

  // Carrito vacío
  if (carrito.length === 0) {
    return (
      <main className="carrito">
        <h2 className="carrito-titulo">Mi carrito</h2>

        <div className="carrito-vacio">
          <div>
            <span className="carrito-icono">🛒</span>
            <h2>Tu carrito está vacío</h2>
            <p>¡Todavía no agregaste ningún producto!</p>

            <Link to="/productos" className="btn-principal">
              Ver productos
            </Link>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
      </main>
    );
  }

  return (
    <main className="carrito">
      <h2 className="carrito-titulo">Mi carrito</h2>

      <section className="carrito-lista">
        {carrito.map((producto) => (
          <article key={producto.id} className="carrito-producto">
            <img src={producto.imagen} alt={producto.nombre} />

            <div className="carrito-producto-info">
              <h3>{producto.nombre}</h3>

              <p className="carrito-precio">
                Precio unitario: ${producto.precio}
              </p>

              <p className="carrito-subtotal">
                Subtotal: ${Number(producto.precio) * producto.cantidad}
              </p>

              <div className="cantidad">
                <button
                  type="button"
                  onClick={() =>
                    cambiarCantidad(producto.id, producto.cantidad - 1)
                  }
                >
                  -
                </button>

                <span>{producto.cantidad}</span>

                <button
                  type="button"
                  onClick={() =>
                    cambiarCantidad(producto.id, producto.cantidad + 1)
                  }
                >
                  +
                </button>
              </div>

              <button
                type="button"
                className="btn-eliminar"
                onClick={() => eliminarDelCarrito(producto.id)}
              >
                Eliminar producto
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="carrito-resumen">
        <h3>Resumen de compra</h3>

        <p className="carrito-resumen-total">Total: ${total}</p>

        <button
          type="button"
          className="btn-vaciar"
          onClick={vaciarCarrito}
        >
          Vaciar carrito
        </button>

        {usuario ? (
          <button
            type="button"
            className="btn-finalizar"
            onClick={finalizarCompra}
            disabled={cargando}
          >
            {cargando ? "Registrando compra..." : "Finalizar compra"}
          </button>
        ) : (
          <p className="carrito-login">
            Para comprar, primero tenés que{" "}
            <Link to="/login">iniciar sesión</Link>.
          </p>
        )}
      </section>

      {error && <p className="error">{error}</p>}
    </main>
  );
}

export default Carrito;
