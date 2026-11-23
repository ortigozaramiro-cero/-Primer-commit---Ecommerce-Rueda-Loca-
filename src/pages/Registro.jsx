
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import useAuth from "../context/hooks/useAuth";
import { db } from "../firebase/config";

function Registro() {
  const { registrar } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    try {
      setCargando(true);

      const { user } = await registrar(email, password);

      await setDoc(doc(db, "usuarios", user.uid), {
        nombre,
        apellido,
        email,
        fechaRegistro: serverTimestamp()
      });

      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error);

      const mensajes = {
        "auth/email-already-in-use": "Este correo ya está registrado.",
        "auth/invalid-email": "El correo electrónico no es válido.",
        "auth/weak-password": "La contraseña es demasiado débil."
      };

      setError(
        mensajes[error.code] ||
        (error.code?.startsWith("auth/")
          ? "No se pudo crear la cuenta. Revisá los datos e intentá nuevamente."
          : "La cuenta pudo haberse creado, pero no se pudieron guardar los datos del perfil en Firestore.")
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="registro-container">
      <div className="registro-card">
        <div className="registro-encabezado">
          <h2>Crear cuenta</h2>
          <p>Sumate a la comunidad de Rueda Loca</p>
        </div>

        <form onSubmit={handleRegistro} className="registro-formulario">
          <div className="registro-campo">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Ingresá tu nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="apellido">Apellido</label>
            <input
              id="apellido"
              type="text"
              placeholder="Ingresá tu apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Creando cuenta..." : "Crear mi cuenta"}
          </button>
        </form>

        <div className="registro-pie">
          <p>
            ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registro;
