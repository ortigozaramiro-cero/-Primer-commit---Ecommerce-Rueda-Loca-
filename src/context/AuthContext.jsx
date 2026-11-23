

import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/config";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [rol, setRol] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Comprobar usuario y su rol en Firestore
  useEffect(() => {
    const cancelarSuscripcion = onAuthStateChanged(
      auth,
      async (usuarioActual) => {
        setCargando(true);
        setUsuario(usuarioActual);

        if (!usuarioActual) {
          setRol(null);
          setCargando(false);
          return;
        }

        try {
          const referencia = doc(
            db,
            "usuarios",
            usuarioActual.uid
          );

          const respuesta = await getDoc(referencia);

          if (respuesta.exists()) {
            setRol(respuesta.data().rol || "cliente");
          } else {
            setRol("cliente");
          }

        } catch (error) {
          console.error("Error al consultar el rol:", error);
          setRol("cliente");
        } finally {
          setCargando(false);
        }
      }
    );

    return () => cancelarSuscripcion();
  }, []);

  // Registrar usuario
  const registrar = (email, password) => {
    return createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  // Iniciar sesión
  const iniciarSesion = (email, password) => {
    return signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  };

  // Cerrar sesión
  const cerrarSesion = () => {
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        rol,
        cargando,
        registrar,
        iniciarSesion,
        cerrarSesion
      }}
    >
      {!cargando && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  return useContext(AuthContext);
}
