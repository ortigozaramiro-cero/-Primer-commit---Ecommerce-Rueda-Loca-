
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-contenido">
        <div className="footer-seccion">
          <h3>Rueda Loca</h3>
          <p>
            Somos una tienda dedicada a la venta de productos deportivos,
            bicicletas y accesorios.
          </p>
          <p>© 2026 Rueda Loca. Todos los derechos reservados.</p>
        </div>

        <div className="footer-seccion">
          <h3>Información</h3>
          <a href="#">Política de privacidad</a>
          <a href="#">Términos y condiciones</a>
          <a href="#">Propiedad intelectual</a>
          <a href="#">Preguntas frecuentes</a>
        </div>

        <div className="footer-seccion">
          <h3>Contacto</h3>
          <p>Email: contacto@ruedaloca.com</p>
          <p>Teléfono: +54 11 4567-8900</p>
          <p>Buenos Aires, Argentina</p>
        </div>

        <div className="footer-seccion">
          <h3>Newsletter</h3>
          <p>Suscribite para recibir novedades y promociones.</p>
          <input type="email" placeholder="Tu email" />
          <button>Suscribirme</button>
        </div>
      </div>

      <div className="equipo">
        <h2>Nuestro equipo</h2>

        <div className="personas">
          <div className="persona">
            <div className="persona-icono">👨‍💻 🛠️</div>
            <h3>Ramiro Ortigoza</h3>
            <p>Técnico mecánico</p>
          </div>

          <div className="persona">
            <div className="persona-icono">👩‍💻 ☎️</div>
            <h3>Laura Kotur</h3>
            <p>Asesora técnica en ciclismo</p>
          </div>

          <div className="persona">
            <div className="persona-icono">👩‍💻 💲</div>
            <h3>Martína Ricter</h3>
            <p>Administración y ventas</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
