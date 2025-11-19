const express = require('express');
const router = express.Router();
const indicioController = require('../controllers/indicioController');
const { auth, verificadorRol } = require('../middleware/auth');

router.use(auth);//Las rutas requieren autenticación
//Rutas de indicios

/**
 * @swagger
 * /api/expedientes/{expedienteId}/indicios:
 *   get:
 *     tags: [Indicios]
 *     summary: Listar indicios
 *     parameters:
 *       - name: expedienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *       - name: incluirEliminados
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de indicios
 */
router.get('/expedientes/:expedienteId/indicios', indicioController.obtenerIndiciosPorExpediente);


/**
 * @swagger
 * /api/expedientes/{expedienteId}/indicios:
 *   post:
 *     tags: [Indicios]
 *     summary: Crear indicio
 *     parameters:
 *       - name: expedienteId
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             descripcion: Arma blanca
 *             color: Plateado
 *             tamanio: 25cm
 *             peso: 200g
 *             ubicacion: Cocina
 *     responses:
 *       201:
 *         description: Indicio creado
 */
router.post('/expedientes/:expedienteId/indicios', indicioController.crearIndicio);

/**
 * @swagger
 * /api/indicios/{id}:
 *   put:
 *     tags: [Indicios]
 *     summary: Actualizar indicio
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
 *             descripcion: Arma blanca actualizada
 *             color: Negro
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/indicios/:id', indicioController.actualizarIndicio);

/**
 * @swagger
 * /api/indicios/{id}:
 *   delete:
 *     tags: [Indicios]
 *     summary: Eliminar indicio
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
router.delete('/indicios/:id', indicioController.eliminarIndicio);

//restaurar indicio (solo admin)
/**
 * @swagger
 * /api/indicios/{id}/restaurar:
 *   put:
 *     tags: [Indicios]
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
router.put('/indicios/:id/restaurar', verificadorRol('ADMIN'), indicioController.restaurarIndicio);

module.exports = router;