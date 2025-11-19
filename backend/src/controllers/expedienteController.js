const { getConnection, sql } = require('../config/database');

exports.obtenerExpedientes = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, estado, incluirEliminados } = req.query;//incluirEliminados: 'true' o 'false' para prueba
    
    const CONN = await getConnection();
    const request = CONN.request();

    // Agregar parámetros opcionales
    if (fechaInicio) {
      request.input('fechaInicio', sql.Date, fechaInicio);
    }
    if (fechaFin) {
      request.input('fechaFin', sql.Date, fechaFin);
    }
    if (estado) {
      request.input('estado', sql.VarChar, estado);
    }
    request.input('incluirEliminados', sql.Bit, incluirEliminados === 'true' ? 1 : 0);

    const result = await request.execute('SP_OBTENER_EXPEDIENTES');

    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });

  } catch (error) {
    console.error('***Error al obtener expedientes:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener expedientes',
      error: error.message 
    });
  }
};



exports.obtenerExpedientePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { incluirEliminado } = req.query;
    
    const CONN = await getConnection();
    const request = CONN.request();
    request.input('expediente_id', sql.Int, id);

    const incluirEliminadoBit = incluirEliminado === 'true' ? 1 : 0;
    request.input('incluirEliminado', sql.Bit, incluirEliminadoBit);

    const result = await request.execute('SP_OBTENER_EXPEDIENTE_POR_ID');

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expediente no encontrado'
      });
    }
    res.json({
      success: true,
      data: result.recordset[0]
    });



  } catch (error) {
    console.error('***Error al obtener expediente:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener expediente',
      error: error.message 
    });
  }
};


exports.crearExpediente = async (req, res) => {
  try {
    const { numero_expediente, descripcion } = req.body;
    const tecnico_id = req.user.id;

    if (!numero_expediente || !descripcion) {
      return res.status(400).json({
        success: false,
        message: 'Número de expediente y descripción son campos requeridos'
      });
    }


    const CONN = await getConnection();
    const result = await CONN.request()
      .input('numero_expediente', sql.VarChar, numero_expediente)
      .input('descripcion', sql.VarChar, descripcion)
      .input('tecnico_id', sql.Int, tecnico_id)
      .execute('SP_INSERTAR_EXPEDIENTE');

    res.status(201).json({
      success: true,
      message: 'Expediente creado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al crear expediente:', error);
    if (error.number === 2627) {
      return res.status(409).json({
        success: false,
        message: 'El número de expediente ya existe'
      });
    }
    res.status(500).json({ 
      success: false,
      message: 'Error al crear expediente',
      error: error.message 
    });
  }

};

exports.actualizarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion } = req.body;

    if (!descripcion) {
      return res.status(400).json({
        success: false,
        message: 'La descripción es requerida'
      });
    }

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .input('descripcion', sql.VarChar, descripcion)
      .execute('SP_ACTUALIZAR_EXPEDIENTE');

    res.json({
      success: true,
      message: 'Expediente actualizado exitosamente',
      data: result.recordset[0]
    });


  } catch (error) {
    console.error('***Error al actualizar expediente:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al actualizar expediente'
    });
  }
};

exports.enviarARevision = async (req, res) => {
  try {
    const { id } = req.params;

    const CONN = await getConnection();
    
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .execute('SP_ENVIAR_EXPEDIENTE_A_REVISION');

    res.json({
      success: true,
      message: 'Expediente enviado a revisión exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al enviar a revisión:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al enviar expediente a revisión'
    });
  }
};


exports.aprobarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const coordinador_id = req.user.id;

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .input('coordinador_id', sql.Int, coordinador_id)
      .execute('SP_APROBAR_EXPEDIENTE');

    res.json({
      success: true,
      message: 'Expediente aprobado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al aprobar expediente:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al aprobar expediente'
    });
  }
};

exports.rechazarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const { justificacion } = req.body;
    const coordinador_id = req.user.id;
    if (!justificacion || justificacion.trim() === '') {
      return res.status(400).json({ 
        success: false,
        message: 'La justificación es requerida para rechazar' 
      });
    }

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .input('coordinador_id', sql.Int, coordinador_id)
      .input('justificacion', sql.VarChar, justificacion)
      .execute('SP_RECHAZAR_EXPEDIENTE');

    res.json({
      success: true,
      message: 'Expediente rechazado',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al rechazar expediente:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al rechazar expediente'
    });
  }
};

exports.eliminarExpediente = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const CONN = await getConnection();
    
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .execute('SP_ELIMINAR_EXPEDIENTE');

    res.json({
      success: true,
      message: 'Expediente eliminado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('Error al eliminar expediente:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al eliminar expediente'
    });
  }
};


exports.restaurarExpediente = async (req, res) => {//[solo para pruebas]
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .execute('SP_RESTAURAR_EXPEDIENTE');

    res.json({
      success: true,
      message: 'Expediente restaurado exitosamente',
      data: result.recordset[0]
    });


  } catch (error) {
    console.error('***Error al restaurar expediente:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al restaurar expediente'
    });
  }
};