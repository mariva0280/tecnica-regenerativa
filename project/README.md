
---

## ✅ Parte 2: GUÍA paso a paso

- >**to-do plan** ordenado para construir el MVP paso a paso.

---

### 🧭 Paso 1: Estructura del proyecto

- [ ] Crear carpetas `/api` y `/app`.
- [ ] Configurar React con Vite en `/client`.
- [ ] Configurar Express en `/server`.
- [ ] Instalar MongoDB (usar MongoDB Atlas para desarrollo).
- [ ] Crear archivo `.env` y definir `MONGO_URI` y `JWT_SECRET`.

---

### 🧭 Paso 2: Backend básico

- [ ] Conectar MongoDB con Mongoose.
- [ ] Crear modelos:
  - `User`
  - `AlumnoAutorizado`
  - `Video`
  - `Pregunta`
- [ ] Rutas:
  - `/api/auth/register`
  - `/api/auth/login`
  - `/api/videos` (GET)
  - `/api/preguntas` (GET, POST, PATCH)
- [ ] Middleware:
  - Verificar JWT
  - Verificar rol (admin/user)
- [ ] Lógica para registrar solo si el email está en `AlumnoAutorizado` y no usado.

---

### 🧭 Paso 3: Frontend básico

- [ ] Configurar React Router.
- [ ] Vistas:
  - Login
  - Registro
  - Página de videos (lista filtrable)
  - Página de preguntas y respuestas (formulario + listado)
- [ ] Guardar JWT en localStorage.
- [ ] Mostrar errores de validación.
- [ ] Layout base con navegación.

---

### 🧭 Paso 4: Integración con Vimeo

- [ ] Admin sube vídeo a Vimeo manualmente.
- [ ] Crea un formulario en el panel admin para guardar:
  - Título
  - Descripción
  - Tratamiento
  - Vimeo ID
- [ ] Mostrar iframe en frontend:
```jsx
<iframe src={`https://player.vimeo.com/video/${vimeoId}`} width="100%" height="360" frameBorder="0" allowFullScreen></iframe>

# ✅ MVP To-Do List – TECNICA REGENERATIVA

Lista de tareas organizadas para completar la primera versión funcional de la plataforma (MVP). Esta lista cubre backend, frontend y algunas tareas extra de configuración.

---

## 🛠️ Backend (API - Express + MongoDB)
- [ ] Inicializar proyecto Node.js con Express
- [ ] Conectar a MongoDB (usando Mongoose)
- [ ] Crear modelo `User`
- [ ] Crear modelo `AlumnoAutorizado`
- [ ] Crear modelo `Video`
- [ ] Crear modelo `Pregunta`
- [ ] Crear ruta de registro con verificación (email o código)
- [ ] Crear ruta de login con JWT
- [ ] Crear middleware para validar JWT y roles (admin / regular)
- [ ] Crear ruta `GET /videos` (filtrados por tratamiento)
- [ ] Crear ruta `POST /preguntas` (enviar pregunta)
- [ ] Crear ruta `GET /preguntas` (ver preguntas y respuestas públicas)
- [ ] Crear ruta `PATCH /preguntas/:id` (responder pregunta – solo admin)

---

## 💻 Frontend (React + Vite)
- [ ] Inicializar proyecto con Vite
- [ ] Configurar React Router
- [ ] Crear página de login
- [ ] Crear página de registro (con código de acceso)
- [ ] Crear página de vídeos (mostrar y filtrar por tratamiento)
- [ ] Crear página de preguntas y respuestas (listado + formulario)
- [ ] Crear navegación principal (Navbar)
- [ ] Mostrar errores y validaciones en formularios

---

## ⚙️ Extras y configuración
- [ ] Crear `.env` y configurar variables en backend
- [ ] Agregar `.gitignore` adecuado
- [ ] Crear ramas `main` y `develop` en Git y subir a GitHub
- [ ] Agregar estructura de carpetas inicial
- [ ] Escribir y mantener el `README.md`
- [ ] Probar el flujo completo de registro, login, vídeos y preguntas

---

## 🧪 Pruebas mínimas
- [ ] Verificar que solo alumnos autorizados pueden registrarse
- [ ] Verificar acceso a vídeos (autenticado)
- [ ] Verificar que todos los usuarios pueden ver preguntas/respuestas
- [ ] Verificar que solo admins pueden responder preguntas

