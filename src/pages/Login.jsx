
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useAuth from "../context/hooks/useAuth";

const mensajesError = {
  "auth/invalid-credential": "El correo o la contraseña son incorrectos.",
  "auth/invalid-email": "El correo electrónico no es válido.",
  "auth/too-many-requests": "Demasiados intentos. Intentá más tarde."
};

function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setCargando(true);
      await iniciarSesion(email, password);
      navigate("/");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError(
        mensajesError[error.code] || "No se pudo iniciar sesión. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="login-container">
      <div className="login-card">
        <div className="login-encabezado">
          <h2>Bienvenido a Rueda Loca</h2>
          <p>Ingresá a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="login-formulario">
          <div className="login-campo">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-campo">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              type="password"
              placeholder="Ingresá tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="login-pie">
          <p>
            ¿Todavía no tenés cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
