const { getConnection, sql } = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //Si no hay email o password retornar error
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email y contraseña son campos requeridos' 
      });
    }

        
    //Ejecutar stored procedure para obtener usuario
    const CONN = await getConnection();
    const result = await CONN.request()
      .input('email', sql.VarChar, email)
      .execute('SP_OBTENER_USUARIO_POR_EMAIL');

    const usuario = result.recordset[0];

    if (!usuario) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, usuario.password);//desencriptar y comparar
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Credenciales inválidas' 
      });
    }

    //Generar JWT al confirmar las credenciales
    const token = jwt.sign(
      { 
        id: usuario.id, 
        email: usuario.email,
        rol: usuario.rol,
        nombre: usuario.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    //Retnornar token y datos del usuario
    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        }
      }
    });
  } catch (error) {
    console.error('***Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message 
    });


  }
};


exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    //Validar campos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son requeridos' 
      });
    }

    //encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    //Ejecutar stored procedure para insertar usuario
    const CONN = await getConnection();
    const result = await CONN.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('password', sql.VarChar, hashedPassword)
      .input('rol', sql.VarChar, rol || 'TECNICO')  //Rol por defecto 'TECNICO' 
      .execute('SP_INSERTAR_USUARIO');

    res.status(201).json({//201: Creado [crear coonstantes de valores de respuesta si hay tiempo]
      success: true,
      message: 'Usuario registrado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {//Considerar error de email duplicado 
    console.error('***Error en registro:', error);
  
    if (error.number === 2627) {//Error de email duplicado [error de db que se usa para validar si no se repite]
      return res.status(409).json({ 
        success: false,
        message: 'El email ya está registrado' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Error en el servidor',
      error: error.message 
    });
  }
};

exports.valdarToken = async (req, res) => {//validar si sigue vigente
  res.json({
    success: true,
    message: 'Token válido',
    data: {
      usuario: req.user
    }
  });
};