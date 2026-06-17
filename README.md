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

https://red-social-tp2-frontend.onrender.com/login

### Backend

https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com

Ruta de prueba del backend:

https://juan-pablo-leiva-tp2-prog4-2026-c1.onrender.com/publicaciones

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
