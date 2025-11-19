const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Rutas públicas
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *           example:
 *             email: tecnico1@mp.gob.gt
 *             password: mp123
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/crearUsuario:
 *   post:
 *     tags: [Autenticación]
 *     summary: Registrar usuario
 *     security: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nombre: Pedro Perez
 *             email: pedrop@mp.gob.gt
 *             password: admin@12345
 *             rol: TECNICO
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/crearUsuario', authController.crearUsuario);

/**
 * @swagger
 * /api/auth/valdarToken:
 *   get:
 *     tags: [Autenticación]
 *     summary: Validar token
 *     responses:
 *       200:
 *         description: Token válido
 */
router.get('/valdarToken', auth, authController.valdarToken);

module.exports = router;