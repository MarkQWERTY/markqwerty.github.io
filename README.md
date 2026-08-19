# Portafolio Profesional & Panel de Administración (Go + PostgreSQL/SQLite)

Portafolio personal monolítico y modular desarrollado en Go con API RESTful, interfaz gráfica responsiva (basada en diseños de Stitch) y panel de administración para gestión de proyectos y mensajes de contacto.

## Stack Tecnológico

- **Backend**: Golang (net/http, database/sql, JWT, Bcrypt)
- **Base de Datos**: PostgreSQL (compatible con Supabase) / SQLite3 (para desarrollo local)
- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript, Google Fonts & Icons
- **Pruebas**: Playwright (E2E Testing)

## Estructura del Proyecto

```
portfolio/
├── cmd/
│   └── servidor/
│       └── main.go         # Punto de entrada del servidor Go
├── internal/
│   ├── config/             # Carga de configuración y variables de entorno
│   ├── db/                 # Conexión DB, esquema y migraciones
│   ├── handlers/           # Handlers API REST y controladores de vistas HTML
│   ├── middleware/         # Middleware de autenticación JWT
│   ├── models/             # Entidades (Administrador, Proyecto, Formulario)
│   └── services/           # Lógica de negocio (Auth, Proyectos, Contacto)
├── web/
│   ├── static/             # Archivos estáticos (CSS, JS, CV PDF)
│   └── templates/          # Vistas HTML (Home, Detalle Proyecto, Login, Admin Dashboard)
├── tests/
│   └── e2e/                # Suite de pruebas automatizadas con Playwright
├── .env.example
├── go.mod
└── README.md
```

## Instrucciones de Ejecución Local

1. **Instalar dependencias de Go**:
   ```bash
   go mod tidy
   ```

2. **Ejecutar el servidor**:
   ```bash
   go run cmd/servidor/main.go
   ```
   El servidor estará disponible en `http://localhost:8080`.

3. **Credenciales por defecto para el Panel de Administración**:
   - **URL**: `http://localhost:8080/admin/login`
   - **ID Administrador**: `1`
   - **Contraseña**: `admin123`

## Endpoints de la API REST (`/api/v1`)

| Método | Endpoint | Acceso | Descripción |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/login` | Público | Autenticación del admin y generación de token JWT |
| `POST` | `/api/v1/auth/logout` | Protegido | Cierre de sesión e invalidación de token |
| `GET` | `/api/v1/auth/me` | Protegido | Datos del administrador en sesión |
| `PATCH` | `/api/v1/auth/password` | Protegido | Actualización de contraseña del admin |
| `GET` | `/api/v1/projects` | Público | Lista de proyectos publicados |
| `GET` | `/api/v1/projects/:id` | Público | Detalle de un proyecto |
| `POST` | `/api/v1/projects` | Protegido | Crear un nuevo proyecto |
| `PUT/PATCH` | `/api/v1/projects/:id` | Protegido | Modificar proyecto existente |
| `DELETE` | `/api/v1/projects/:id` | Protegido | Eliminar un proyecto |
| `POST` | `/api/v1/contact-submissions` | Público | Enviar mensaje desde el formulario web |
| `GET` | `/api/v1/contact-submissions` | Protegido | Listar mensajes recibidos |
| `DELETE` | `/api/v1/contact-submissions/:id` | Protegido | Eliminar mensaje |
| `GET` | `/api/v1/dashboard/stats` | Protegido | Estadísticas rápidas para el dashboard |

## Pruebas Automatizadas

Para ejecutar las pruebas End-to-End con Playwright:
```bash
npx playwright test
```
