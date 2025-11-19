const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', ''); //Obtener token del header
    
    if (!token) {
      return res.status(401).json({ //Error 401: No autorizado
        success: false,
        message: 'No hay token de autenticación' 
      });
    }

    //Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ //Error 401: No autorizado
      success: false,
      message: 'Token inválido o expirado' 
    });
  }
};

//Verificador roles
const verificadorRol = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'No autenticado' 
      });
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        success: false,
        message: 'No tiene permisos' 
      });
    }

    next();
  };
};

module.exports = { auth, verificadorRol };
