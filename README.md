# 🧠 Plataforma de formación - TECNICA REGENERATIVA

Proyecto desarrollado en MERN(MongoDB, Express, React, Node.js) para ofrecer contenido formativo exclusivo a alumnos verificados de la academia. La plataforma incluye acceso a videos clasificados por tratamiento y una sección de preguntas / respuestas públicas para todos los alumnos.

---

### 🎯 Funcionalidades MVP (versión inicial)

### 👨‍🎓 Alumno
- Registro solo si está verificado como alumno autorizado ( email o código ).
- Login con JWT.
- Acceso a videos clasificados por tratamiento.
- Enviar preguntas desde la app.
- Ver todas las preguntas / respuestas publicadas por otros usuarios de la app.

### 👮‍♂️ Administrador / administradores
- Login como administrador.
- Añadir vídeos manualmente (ya subidos a Vimeo).
- Clasificarlos por tratamiento.
- Responder preguntas enviadas por los alumnos.
- Las respuestas son públicas para todos los alumnos.

---

## 🛠️ Tecnologías utilizadas

-**Frontend**: React + React Router + Tailwind CSS
-**Backend**: Node.js + Express.js
-**Base de datos**: MongoDB
-**Autenticación**: JWT + Middleware de roles
-**Video**: Vimeo (sólo enlace embebido, no almacenamineto local)

---

## 📂 Estructura del proyecto

- `project/`
 - `api/ Backend (Node + Express)`
 - `app/ Frontend (React)`
 - `README.md Documentación principal`

---

## 🧱 Modelos principales (MongoDB)

### Usuario (`User`)
- id (ObjectId autogenerado)
- nombre (string, required)
- username (string, required, unique)
- email (string, required, unique)
- password (string, required)
- role (string, values: regular | admin, required)
- verificado (boolean, default: false)

### Alumno autorizado (`AlumnoAutorizado`)
- email (string, required, unique)
- codigo (string)
- usado (boolean, default: false)

### Video (`Video`)
- titulo (string, required)
- description (string, required)
- zona tratamiento (string, required)
- vimeoId (string, required, ID o URL parcial de Vimeo)
- vimeoHash (string, required, default: null)
- isPublished (boolean, default: false)

### Pregunta (`Pregunta`)
- autorId (ObjectId, referencia a User)
- tratamiento (string, required)
- texto (string, required)
- respuesta (string)
- estado (string, values: pendiente | respondida, defalult: pendiente)
- fechaPregunta (date autogenerado)
- fechaRespuesta (date)

---
