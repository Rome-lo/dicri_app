const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const expedienteRoutes = require('./routes/expedientes');
const indicioRoutes = require('./routes/indicios');
const reporteRoutes = require('./routes/reportes');

const app = express();

//CORS Configuracion
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Log de requests en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

//Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API DICRI - Documentación',
  customfavIcon: '/favicon.ico'
}));
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

//-----------------------------Ruta raíz-----------------------------
app.get('/', (req, res) => {
  res.json({ 
    message: 'API DICRI - Ministerio Público de Guatemala',
    version: '1.0.0',
    status: 'running',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      expedientes: '/api/expedientes',
      indicios: '/api/expedientes/:id/indicios',
      reportes: '/api/reportes'
    }
  });
});

//-----------------------------Rutas API-----------------------------
app.use('/api/auth', authRoutes);
app.use('/api/expedientes', expedienteRoutes);
app.use('/api', indicioRoutes);
app.use('/api/reportes', reporteRoutes);

//-----------------------------Errores-----------------------------
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});
app.use((err, req, res, next) => {
  console.error('***Error no manejado:', err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || 'Error interno del servidor'
  });
});

const PORT = process.env.PORT || 5050;

//Solo iniciar servidor si no estamos en modo test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('----------------------------------------------------------');
    console.log('----------------------------------------------------------');
    console.log('                  Servidor DICRI Backend');
    console.log('----------------------------------------------------------');
    console.log('----------------------------------------------------------');
    console.log(`Puerto: ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    console.log('----------------------------------------------------------');
    console.log('----------------------------------------------------------');
  });
}

module.exports = app;