const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API DICRI - EVALUACION',
      version: '1.0.0'
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints para autenticación y gestión de usuarios'
      },
      {
        name: 'Expedientes',
        description: 'Gestión de expedientes criminalísticos'
      },
      {
        name: 'Indicios',
        description: 'Gestión de indicios y evidencias'
      },
      {
        name: 'Reportes',
        description: 'Generación de reportes y estadísticas'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint de login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'tecnico1@mp.gob.gt' },
            rol: { 
              type: 'string', 
              enum: ['TECNICO', 'COORDINADOR', 'ADMIN'],
              example: 'TECNICO'
            },
            activo: { type: 'boolean', example: true },
            fecha_creacion: { type: 'string', format: 'date-time' }
          }
        },
        Expediente: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            numero_expediente: { type: 'string', example: 'MP-2025-001' },
            descripcion: { type: 'string', example: 'Investigación de robo a mano armada' },
            fecha_registro: { type: 'string', format: 'date-time' },
            estado: { 
              type: 'string', 
              enum: ['EN_REGISTRO', 'EN_REVISION', 'APROBADO', 'RECHAZADO'],
              example: 'EN_REGISTRO'
            },
            tecnico_nombre: { type: 'string', example: 'Juan Pérez' },
            coordinador_nombre: { type: 'string', example: 'Carlos López' },
            justificacion_rechazo: { type: 'string', nullable: true },
            fecha_aprobacion: { type: 'string', format: 'date-time', nullable: true },
            activo: { type: 'boolean', example: true },
            total_indicios: { type: 'integer', example: 3 }
          }
        },
        Indicio: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            expediente_id: { type: 'integer', example: 1 },
            descripcion: { type: 'string', example: 'Arma blanca tipo cuchillo' },
            color: { type: 'string', example: 'Plateado', nullable: true },
            tamanio: { type: 'string', example: '25cm', nullable: true },
            peso: { type: 'string', example: '200g', nullable: true },
            ubicacion: { type: 'string', example: 'Escena del crimen - Cocina' },
            tecnico_nombre: { type: 'string', example: 'Juan Pérez' },
            fecha_registro: { type: 'string', format: 'date-time' },
            activo: { type: 'boolean', example: true }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Mensaje de error' },
            error: { type: 'string' }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
