
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

import useAuth from "../context/hooks/useAuth";
import { db } from "../firebase/config";

function Perfil() {
  const { usuario } = useAuth();

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerPerfil = async () => {
      if (!usuario) {
        setCargando(false);
        return;
      }

      try {
        const respuesta = await getDoc(doc(db, "usuarios", usuario.uid));

        if (respuesta.exists()) {
          setPerfil(respuesta.data());
        } else {
          setError("No se encontró el perfil del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setError("No se pudieron cargar los datos del perfil.");
      } finally {
        setCargando(false);
      }
    };

    obtenerPerfil();
  }, [usuario]);

  if (cargando) return <p className="perfil-mensaje">Cargando perfil...</p>;
  if (error) return <p className="perfil-mensaje error">{error}</p>;
  if (!perfil) return <p className="perfil-mensaje">No hay datos disponibles.</p>;

  return (
    <section className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-encabezado">
          <div className="perfil-avatar">
            {perfil.nombre?.charAt(0).toUpperCase() || "U"}
          </div>

          <h2>Mi perfil</h2>
          <p>Bienvenido a Rueda Loca</p>
        </div>

        <div className="perfil-datos">
          <div className="perfil-item">
            <span>Nombre</span>
            <strong>{perfil.nombre || "No disponible"}</strong>
          </div>

          <div className="perfil-item">
            <span>Apellido</span>
            <strong>{perfil.apellido || "No disponible"}</strong>
          </div>

          <div className="perfil-item">
            <span>Correo electrónico</span>
            <strong>{perfil.email || usuario.email}</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Perfil;
