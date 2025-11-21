# Sistema DICRI - Ministerio Público de Guatemala

Sistema de gestión de evidencias criminalísticas para la Dirección de Investigación Criminalística (DICRI) del Ministerio Público de Guatemala.

## Descripción
Propuesta de sistema para evaluación MP

### Funcionalidades Principales

- Gestión completa de expedientes criminalísticos
- Registro de indicios y expedientes
- Flujo de aprobación (Técnico - Coordinador)
- Sistema de roles (TÉCNICO, COORDINADOR, ADMIN)
- Reportes estadísticos
- Autenticación JWT con expiración (24h)
- API REST documentada con Swagger
- Arquitectura con Docker

### Funcionalidades por Rol

#### TÉCNICO
- Crear y editar expedientes en estado EN_REGISTRO
- Agregar, editar y eliminar indicios
- Enviar expedientes a revisión

#### COORDINADOR
- Ver expedientes en revisión
- Aprobar expedientes
- Rechazar expedientes con justificación
- Acceso a estadísticas

#### ADMIN
- Acceso completo al sistema

---

## Tecnologías

### Frontend
- React 18
- Bootstrap 5

### Backend
- Node 22
- Express 5
- SQL Server 2019

### DevOps
- Docker
- Docker Compose
- Nginx 

---

## Instalación

### Instrucciones
```bash
# Clonar repositorio
git clone https://github.com/Rome-lo/dicri_app.git
cd dicri_app

# Construir y levantar servicios
docker-compose up --build -d
```
---

### Acceso al Sistema

- Frontend | http://localhost:3000
- Backend | http://localhost:5050/api
- Swagger | http://localhost:5050/api-docs

## Usuarios de Prueba

Estos usuarios están cargados por defecto en el sistema

Email: tecnico1@mp.gob.gt
Pass: mp123
Rol: TÉCNICO

Email: tecnico2@mp.gob.gt
Pass: mp123
Rol: TÉCNICO

Email: coordinador1@mp.gob.gt
Pass: mp123
Rol: COORDINADOR

Email: admin@mp.gob.gt
Pass: mp123
Rol: ADMIN

---


## Estructura del Proyecto
```
dicri_app/
├── backend/                    # Backend Node.js
│   ├── src/
│   │   ├── config/            # Configuraciones (DB, Swagger)
│   │   ├── controllers/       # Controladores de rutas
│   │   ├── middleware/        # Middlewares (auth, validación)
│   │   ├── routes/            # Definición de rutas
│   │   └── app.js             # Archivo inicio
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── .env
├── frontend/                   # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes React
│   │   │   ├── common/       # Componentes reutilizables
│   │   │   └── layout/       # Layout (Navbar)
│   │   ├── context/          # React Context (Auth)
│   │   ├── pages/            # Páginas de la aplicación
│   │   ├── services/         # Servicios API
│   │   ├── styles/           # Estilos personalizados
│   │   ├── App.jsx
│   │   └── index.js
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── .dockerignore
│   ├── package.json
│   ├── .env
│   └── .env.production
├── database/
│   └── scripts/               # Scripts SQL
│       ├── 01_tablas_estructura.sql
│       ├── 02_procedimientos.sql
│       └── 03_data_prueba.sql
├── docker-compose.yml         # Orquestación de servicios
├── database.sh                # Script de inicialización BD
├── .gitignore
└── README.md
```

**Nota Importante:**

Este sistema está configurado para ambiente de **desarrollo y demostración**. Las credenciales y configuraciones son de prueba. Para un ambiente de producción se requieren configuraciones adicionales de seguridad, optimización y monitoreo.
