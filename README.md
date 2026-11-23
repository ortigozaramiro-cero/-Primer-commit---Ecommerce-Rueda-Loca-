# 🚴 Rueda Loca - Ecommerce de Bicicletas

## Descripción

Rueda Loca es una tienda online de bicicletas y accesorios desarrollada con React. Permite a los usuarios explorar productos, consultar sus detalles, gestionar un carrito de compras y realizar pedidos.

La aplicación cuenta con autenticación de usuarios, historial de pedidos y un panel de administración para gestionar los productos.

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- React Router DOM
- Firebase Authentication
- Cloud Firestore
- Context API
- CSS3
- Git y GitHub
- Vercel

## Funcionalidades

### Usuarios
- Registro e inicio de sesión.
- Cierre de sesión.
- Perfil de usuario.
- Rutas protegidas.
- Historial de pedidos.

### Productos
- Catálogo conectado a Firestore.
- Búsqueda de productos.
- Paginación.
- Vista de detalle de cada producto.

### Carrito de compras
- Agregar productos.
- Incrementar y disminuir cantidades.
- Eliminar productos.
- Vaciar el carrito.
- Persistencia mediante localStorage.
- Cálculo automático del total.
- Finalización de compras y registro de pedidos.

### Administración
- Acceso exclusivo para administradores.
- Alta de productos.
- Edición de productos.
- Eliminación de productos.
- Validación de formularios.
- Confirmación antes de eliminar.

## Instalación y ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/ortigozaramiro-cero/-Primer-commit---Ecommerce-Rueda-Loca-.git
   ```

2. Ingresar a la carpeta del proyecto:

   ```bash
   cd -Primer-commit---Ecommerce-Rueda-Loca-
   ```

3. Instalar las dependencias:

   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Para generar la versión de producción:

   ```bash
   npm run build
   ```

## Enlaces del proyecto

- **Aplicación publicada:** https://primer-commit-ecommerce-rueda-loca.vercel.app/
- **Repositorio GitHub:** https://github.com/ortigozaramiro-cero/-Primer-commit---Ecommerce-Rueda-Loca-

## Acceso de administrador

Credenciales solicitadas 

- **Email:** admin@gmail.com
- **Contraseña:** admin123

El usuario administrador debe tener el rol `admin` asignado en la colección `usuarios` de Firestore.

## Autor

Proyecto desarrollado como entrega final del curso de React JS.