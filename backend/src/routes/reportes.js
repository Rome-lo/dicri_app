const express = require('express');
const router = express.Router();
const reporteController = require('../controllers/reporteController');
const { auth, verificadorRol } = require('../middleware/auth');

router.use(auth);

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     tags: [Reportes]
 *     summary: Generar reporte (Coordinador/Admin)
 *     parameters:
 *       - name: fechaInicio
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: fechaFin
 *         in: query
 *         schema:
 *           type: string
 *           format: date
 *       - name: incluirEliminados
 *         in: query
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Reporte generado
 */
router.get('/', verificadorRol('COORDINADOR', 'ADMIN'), reporteController.obtenerReporteGeneral);

module.exports = router;