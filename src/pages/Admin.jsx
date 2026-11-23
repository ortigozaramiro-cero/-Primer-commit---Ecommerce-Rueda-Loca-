import { useEffect, useState } from "react";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  writeBatch
} from "firebase/firestore";

import { db } from "../firebase/config";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  imagen: ""
};
const productosIniciales = [
  {
    nombre: "Bicicleta Mountain Bike Venzo",
    precio: 650000,
    categoria: "Bicicletas MTB",
    imagen: "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?auto=format&fit=crop&w=800&q=80",
    descripcion: "Bicicleta Mountain Bike ideal para caminos de montaña, senderos y uso urbano."
  },
  {
    nombre: "Bicicleta Urbana Rodado 28",
    precio: 480000,
    categoria: "Bicicletas Urbanas",
    imagen: "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?auto=format&fit=crop&w=800&q=80",
    descripcion: "Bicicleta urbana cómoda y práctica para desplazarse por la ciudad."
  },
  {
    nombre: "Bicicleta BMX Pro",
    precio: 390000,
    categoria: "BMX",
    imagen: "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=800&q=80",
    descripcion: "Bicicleta BMX resistente, ideal para trucos, saltos y circuitos urbanos."
  },
  {
    nombre: "Casco Bell MTB",
    precio: 85000,
    categoria: "Cascos",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/sin-titulo-101-5050ef62da5f5a828e15967522784150-480-0.webp",
    descripcion: "Casco para ciclismo con diseño liviano y protección para recorridos de montaña."
  },
  {
    nombre: "Guantes para Ciclismo",
    precio: 35000,
    categoria: "Indumentaria",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/horquilla-fox-38-performance-29-con-arcopuente-nuevo-44mm-offset-grip-170mm-sin-caja-8c6c433072923e016017784671882188-240-0.webp",
    descripcion: "Guantes deportivos con protección y agarre para mayor comodidad durante el recorrido."
  },
  {
    nombre: "Luces LED para Bicicleta",
    precio: 28000,
    categoria: "Accesorios",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/pbtllkn-600-12-2025-10-28t202033-414-ca10e926620fb939dd17616936834669-480-0.webp",
    descripcion: "Kit de luces LED delanteras y traseras para mejorar la visibilidad durante la noche."
  },
  {
    nombre: "Kit de Herramientas para Bicicleta",
    precio: 45000,
    categoria: "Herramientas",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/768686286636-1-573285090821b4946717335179491698-480-0.webp",
    descripcion: "Kit completo de herramientas para realizar mantenimiento básico de tu bicicleta."
  },
  {
    nombre: "Inflador de Pie con Manómetro",
    precio: 42000,
    categoria: "Herramientas",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/pbtllkn-600-12-2025-06-04t202805-815-c77f521e1989c6186117490797880963-480-0.webp",
    descripcion: "Inflador de pie con manómetro para controlar fácilmente la presión de las cubiertas."
  },
  {
    nombre: "Portabotella de Aluminio",
    precio: 22000,
    categoria: "Accesorios",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/diseno-sin-titulo-11-d56e9e6313a9ffe8e217761815167329-480-0.webp",
    descripcion: "Portabotella de aluminio liviano y resistente para llevar agua durante tus recorridos."
  },
  {
    nombre: "Cubierta MTB Rodado 29",
    precio: 55000,
    categoria: "Repuestos",
    imagen: "https://acdn-us.mitiendanube.com/stores/001/177/160/products/diseno-sin-titulo131-6b9addbd4db7c8570f16807306158923-480-0.webp",
    descripcion: "Cubierta para bicicleta MTB rodado 29, diseñada para ofrecer buen agarre y durabilidad."
  }
];

function Admin() {
  const [productos, setProductos] = useState([]);
  const [producto, setProducto] = useState(formularioInicial);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [importando, setImportando] = useState(false);
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

  
const reemplazarCatalogo = async () => {
  const confirmar = window.confirm(
    "ATENCIÓN: se eliminarán todos los productos actuales y se cargarán los 10 productos nuevos. ¿Querés continuar?"
  );

  if (!confirmar) return;

  try {
    setImportando(true);
    setError("");

    const lote = writeBatch(db);
    const consulta = await getDocs(collection(db, "productos"));

    consulta.docs.forEach((documento) => {
      lote.delete(documento.ref);
    });

    productosIniciales.forEach((item) => {
      const nuevoDocumento = doc(collection(db, "productos"));
      lote.set(nuevoDocumento, item);
    });

    await lote.commit();

    alert("¡Catálogo reemplazado correctamente!");
  } catch (error) {
    console.error("Error al reemplazar catálogo:", error);
    setError("No se pudo reemplazar el catálogo. Revisá la consola y los permisos de Firebase.");
  } finally {
    setImportando(false);
  }
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
      <button
  type="button"
  onClick={reemplazarCatalogo}
  disabled={importando || guardando}
>
  {importando ? "Reemplazando catálogo..." : "Reemplazar catálogo por 10 productos"}
</button>
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
