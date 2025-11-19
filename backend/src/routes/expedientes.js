const express = require('express');
const router = express.Router();
const expedienteController = require('../controllers/expedienteController');
const { auth, verificadorRol } = require('../middleware/auth');

//Las rutas requieren autenticación
router.use(auth);
//Rutas accesibles por todos los roles autenticados

/**
 * @swagger
 * /api/expedientes:
 *   get:
 *     tags: [Expedientes]
 *     summary: Listar expedientes
 *     parameters:
 *       - name: fechaInicio
 *         in: query
 *         schema:
 *           type: string
 *       - name: fechaFin
 *         in: query
 *         schema:
 *           type: string
 *       - name: estado
 *         in: query
 *         schema:
 *           type: string
 *       - name: incluirEliminados
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de expedientes
 */
router.get('/', expedienteController.obtenerExpedientes);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   get:
 *     tags: [Expedientes]
 *     summary: Obtener expediente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Expediente encontrado
 */
router.get('/:id', expedienteController.obtenerExpedientePorId);

/**
 * @swagger
 * /api/expedientes:
 *   post:
 *     tags: [Expedientes]
 *     summary: Crear expediente
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             numero_expediente: MP-2025-010
 *             descripcion: Nuevo caso de investigación
 *     responses:
 *       201:
 *         description: Expediente creado
 */
router.post('/', expedienteController.crearExpediente);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   put:
 *     tags: [Expedientes]
 *     summary: Actualizar expediente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             descripcion: Descripción actualizada
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/:id', expedienteController.actualizarExpediente);

/**
 * @swagger
 * /api/expedientes/{id}:
 *   delete:
 *     tags: [Expedientes]
 *     summary: Eliminar expediente
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado
 */
router.delete('/:id', expedienteController.eliminarExpediente);

/**
 * @swagger
 * /api/expedientes/{id}/enviar-revision:
 *   put:
 *     tags: [Expedientes]
 *     summary: Enviar a revisión
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enviado a revisión
 */
router.put('/:id/enviar-revision', expedienteController.enviarARevision);

/**
 * @swagger
 * /api/expedientes/{id}/aprobar:
 *   put:
 *     tags: [Expedientes]
 *     summary: Aprobar (Coordinador)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aprobado
 */
router.put('/:id/aprobar', verificadorRol('COORDINADOR', 'ADMIN'), expedienteController.aprobarExpediente);

/**
 * @swagger
 * /api/expedientes/{id}/rechazar:
 *   put:
 *     tags: [Expedientes]
 *     summary: Rechazar (Coordinador)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             justificacion: Faltan datos
 *     responses:
 *       200:
 *         description: Rechazado
 */
router.put('/:id/rechazar', verificadorRol('COORDINADOR', 'ADMIN'), expedienteController.rechazarExpediente);

/**
 * @swagger
 * /api/expedientes/{id}/restaurar:
 *   put:
 *     tags: [Expedientes]
 *     summary: Restaurar (Admin)
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurado
 */
router.put('/:id/restaurar', verificadorRol('ADMIN'), expedienteController.restaurarExpediente);

module.exports = router;