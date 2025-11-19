const { getConnection, sql } = require('../config/database');

exports.obtenerIndiciosPorExpediente = async (req, res) => {
  try {
    const { expedienteId } = req.params;
    const { incluirEliminados } = req.query;
    
    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, expedienteId)
      .input('incluirEliminados', sql.Bit, incluirEliminados === 'true' ? 1 : 0)
      .execute('SP_OBTENER_INDICIOS_POR_EXPEDIENTE');
    res.json({
      success: true,
      data: result.recordset,
      count: result.recordset.length
    });
  } catch (error) {

    console.error('***Error al obtener indicios:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener indicios',
      error: error.message 
    });
  }
};

exports.crearIndicio = async (req, res) => {
  try {
    const { expedienteId } = req.params;
    const { descripcion, color, tamanio, peso, ubicacion } = req.body;
    const tecnico_id = req.user.id;

    if (!descripcion) {
      return res.status(400).json({
        success: false,
        message: 'La descripción es requerida'
      });
    }


    const CONN = await getConnection();
    const result = await CONN.request()
      .input('expediente_id', sql.Int, expedienteId)
      .input('descripcion', sql.VarChar, descripcion)
      .input('color', sql.VarChar, color || null)
      .input('tamanio', sql.VarChar, tamanio || null)
      .input('peso', sql.VarChar, peso || null)
      .input('ubicacion', sql.VarChar, ubicacion || null)
      .input('tecnico_id', sql.Int, tecnico_id)
      .execute('SP_INSERTAR_INDICIO');

    res.status(201).json({
      success: true,
      message: 'Indicio creado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al crear indicio:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al crear indicio'
    });
  }
};

exports.actualizarIndicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, color, tamanio, peso, ubicacion } = req.body;

    if (!descripcion) {
      return res.status(400).json({
        success: false,
        message: 'La descripción es requerida'
      });
    }


    const CONN = await getConnection();
    const result = await CONN.request()
      .input('indicio_id', sql.Int, id)
      .input('descripcion', sql.VarChar, descripcion)
      .input('color', sql.VarChar, color || null)
      .input('tamanio', sql.VarChar, tamanio || null)
      .input('peso', sql.VarChar, peso || null)
      .input('ubicacion', sql.VarChar, ubicacion || null)
      .execute('SP_ACTUALIZAR_INDICIO');

    res.json({
      success: true,
      message: 'Indicio actualizado exitosamente',
      data: result.recordset[0]
    });


  } catch (error) {
    console.error('***Error al actualizar indicio:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al actualizar indicio'
    });

  }
};

exports.eliminarIndicio = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('indicio_id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .execute('SP_ELIMINAR_INDICIO');

    res.json({
      success: true,
      message: 'Indicio eliminado exitosamente',
      data: result.recordset[0]
    });

  } catch (error) {
    console.error('***Error al eliminar indicio:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al eliminar indicio'
    });
  }
};


exports.restaurarIndicio = async (req, res) => {//[prueba]
  try {
    const { id } = req.params;
    const usuario_id = req.user.id;

    const CONN = await getConnection();
    const result = await CONN.request()
      .input('indicio_id', sql.Int, id)
      .input('usuario_id', sql.Int, usuario_id)
      .execute('SP_RESTAURAR_INDICIO');

    res.json({
      success: true,
      message: 'Indicio restaurado exitosamente',
      data: result.recordset[0]
    });
    //


  } catch (error) {
    console.error('***Error al restaurar indicio:', error);
    res.status(400).json({ 
      success: false,
      message: error.message || 'Error al restaurar indicio'
    });
  }
};