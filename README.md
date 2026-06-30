# Trabajo Práctico #2 - Red Social

## Alumno

**Juan Pablo Leiva**

## Materia

**Programación IV - UTN Avellaneda**

## Proyecto

Aplicación web de tipo red social desarrollada como Trabajo Práctico #2.

La aplicación se encuentra dividida en dos proyectos separados:

- **Frontend:** Angular
- **Backend:** NestJS
- **Base de datos:** MongoDB Atlas

## Deploy

### Frontend

https://red-social-tp2-frontend.onrender.com

### Backend

https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com



## Tecnologías utilizadas

### Frontend

- Angular
- TypeScript
- Bootstrap
- HTML
- CSS
- Render Static Site

### Backend

- NestJS
- TypeScript
- MongoDB
- Mongoose
- BcryptJS
- Multer
- Render Web Service

### Base de datos

- MongoDB Atlas

## Sprint #1

En este sprint se implementó la configuración inicial de la red social.

### Frontend

Se creó el proyecto Angular con las siguientes pantallas:

- Registro
- Login
- Publicaciones
- Mi Perfil

También se implementó:

- Navegación entre componentes.
- Navbar desplegable y responsive.
- Diseño uniforme con Bootstrap y estilos propios.
- Favicon personalizado.
- Formulario de login con validaciones.
- Formulario de registro con validaciones específicas.
- Campo de tipo file para imagen de perfil.
- Vista previa de imagen al registrarse.
- Mensajes claros para errores y validaciones.

### Backend

Se creó el proyecto NestJS con los siguientes módulos:

- Autenticación
- Usuarios
- Publicaciones

También se implementó:

- Conexión a MongoDB Atlas.
- Registro de usuarios por método POST.
- Login de usuarios por método POST.
- Validación de datos recibidos.
- Encriptación de contraseña con BcryptJS.
- Guardado de imagen de perfil en el servidor.
- Guardado de la URL de imagen en la base de datos.
- Validación de correo único.
- Validación de nombre de usuario único.
- Respuestas con status codes correctos.

## Usuarios

El login permite ingresar con:

- Correo electrónico
- Nombre de usuario

La contraseña debe cumplir con:

- Mínimo 8 caracteres.
- Al menos una letra mayúscula.
- Al menos un número.

## Notas

El proyecto no utiliza `alert()`.  
Los mensajes se muestran dentro de la interfaz con estilos propios.

La contraseña queda encriptada en la base de datos.

La imagen de perfil se guarda y su URL queda asociada al usuario registrado.

## Sprint #2

Se agregó el manejo real de publicaciones y las acciones principales de la red social.

### Frontend

- Listado de publicaciones reales desde el backend.
- Ordenamiento por fecha o por cantidad de me gusta.
- Paginación con límite de publicaciones por carga.
- Componente reutilizable para mostrar cada publicación.
- Alta de publicaciones con título, descripción e imagen opcional.
- Acción para dar y quitar me gusta.
- Baja lógica de publicaciones propias.
- Mi Perfil muestra los datos del usuario, foto de perfil y las últimas 3 publicaciones.

### Backend

- Schema de publicaciones en MongoDB.
- Alta de publicaciones asociadas a un usuario.
- Guardado de imagen opcional y URL en base de datos.
- Listado con filtros por usuario, ordenamiento y paginación.
- Baja lógica de publicaciones.
- Validación para que solo el autor pueda eliminar su publicación.
- Me gusta único por usuario y publicación.
- Eliminación de me gusta si el usuario ya lo había realizado.

## Sprint #3

Se completó el detalle de publicación con comentarios y el manejo de sesión con token.

### Frontend

- Página de detalle para ver una publicación completa.
- Alta de comentarios.
- Listado de comentarios paginado con botón para cargar más.
- Edición de comentarios propios.
- Indicación visual cuando un comentario fue editado.
- Guardado del token en el navegador al iniciar sesión o registrarse.
- Pantalla de cargando con spinner y validación de sesión.
- Aviso de sesión próxima a vencer y opción para extenderla.
- Redirección al login ante respuestas 401.

### Backend

- Token de sesión con vencimiento de 15 minutos.
- Ruta para autorizar token.
- Ruta para refrescar token.
- Alta, listado y modificación de comentarios.
- Comentarios ordenados por fecha y paginados.

## Sprint #4

Se agregó la administración de usuarios, estadísticas, PWA, pipes y directivas propias.

### Frontend

- Baja lógica de publicaciones habilitada para administradores.
- Dashboard de usuarios solo para administradores.
- Listado de usuarios.
- Alta de usuarios desde dashboard con perfil usuario o administrador.
- Habilitación y deshabilitación de usuarios.
- Dashboard de estadísticas con filtros por fecha.
- Gráficos de barras, línea y torta.
- Configuración PWA.
- Pipes propias: fecha corta, iniciales y resumen.
- Directivas propias: auto focus, imagen fallback y resaltado de elemento propio.

### Backend

- Controller de usuarios para administrador.
- Listado de usuarios.
- Alta de usuarios desde dashboard.
- Baja y alta lógica de usuarios.
- Controller de estadísticas dentro del módulo publicaciones.
- Rutas GET para las estadísticas del dashboard.
- Validación de token de administrador en rutas privadas de dashboard.
