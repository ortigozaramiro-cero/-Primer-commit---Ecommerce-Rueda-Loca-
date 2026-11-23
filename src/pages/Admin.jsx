import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot
} from "firebase/firestore";

import { db } from "../firebase/config";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: ""
};

function Admin() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(formularioInicial);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
 
  useEffect(() => {
    return onSnapshot(
      collection(db, "productos"),
      (consulta) => {
        setProductos(
          consulta.docs.map((documento) => ({
            id: documento.id,
            ...documento.data()
          }))
        );
        setCargando(false);
      },
      (error) => {
        console.error(error);
        setError("No se pudieron cargar los productos.");
        setCargando(false);
      }
    );
  }, []);

  const manejarCambio = (e) => {
    setProducto((actual) => ({
      ...actual,
      [e.target.name]: e.target.value
    }));
  };

  const limpiarFormulario = () => {
    setProducto(formularioInicial);
    setProductoEditando(null);
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError("");

    const { nombre, descripcion, precio, imagen } = producto;

    if (!nombre.trim()) return setError("El nombre es obligatorio.");
    if (!descripcion.trim()) return setError("La descripción es obligatoria.");
    const precioNumerico = Number(precio);
    if (!precio.trim() || !Number.isFinite(precioNumerico) || precioNumerico <= 0) {
      return setError("El precio debe ser un número mayor que cero.");
    }
    if (!imagen.trim()) return setError("La imagen es obligatoria.");

    const datos = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: precioNumerico,
      imagen: imagen.trim()
    };

    try {
      setGuardando(true);

      if (productoEditando) {
        await updateDoc(doc(db, "productos", productoEditando), datos);
      } else {
        await addDoc(collection(db, "productos"), datos);
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      setError("No se pudo guardar el producto. Revisá los permisos de Firebase.");
    } finally {
      setGuardando(false);
    }
  };

  const editarProducto = (item) => {
    setProductoEditando(item.id);
    setProducto({
      nombre: item.nombre || "",
      descripcion: item.descripcion || "",
      precio: String(item.precio ?? ""),
      imagen: item.imagen || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

const eliminarProducto = async (id) => {
  if (!window.confirm("¿Estás seguro de que querés eliminar este producto?")) {
    return;
  }

  try {
    setError("");
    await deleteDoc(doc(db, "productos", id));
  } catch (error) {
    console.error(error);
    setError("No se pudo eliminar el producto. Revisá los permisos de Firebase.");
  }
};

  
  return (
    <main className="admin-container">
      <h1>Administrar productos</h1>
     
      <form onSubmit={guardarProducto} className="admin-form">
        <h2>{productoEditando ? "Editar producto" : "Agregar producto"}</h2>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={producto.nombre}
          onChange={manejarCambio}
        />

        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={producto.descripcion}
          onChange={manejarCambio}
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          min="0.01"
          step="0.01"
          value={producto.precio}
          onChange={manejarCambio}
        />

        <input
          type="url"
          name="imagen"
          placeholder="URL de la imagen"
          value={producto.imagen}
          onChange={manejarCambio}
        />

        {error && <p className="admin-error">{error}</p>}

        <button type="submit" disabled={guardando}>
          {guardando
            ? "Guardando..."
            : productoEditando
              ? "Guardar cambios"
              : "Agregar producto"}
        </button>

        {productoEditando && (
          <button type="button" onClick={limpiarFormulario}>
            Cancelar edición
          </button>
        )}
      </form>

      <section className="admin-lista">
        <h2>Productos existentes</h2>

        {cargando ? (
          <p>Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          productos.map((item) => (
            <article key={item.id} className="admin-producto">
              <img src={item.imagen} alt={item.nombre} />

              <div>
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <strong>${item.precio}</strong>
              </div>

              <button type="button" onClick={() => editarProducto(item)}>
                Editar
              </button>

              <button type="button" onClick={() => eliminarProducto(item.id)}>
                Eliminar
              </button>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default Admin;
