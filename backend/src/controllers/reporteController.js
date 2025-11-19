const { getConnection, sql } = require('../config/database');

exports.obtenerReporteGeneral = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, incluirEliminados } = req.query;
    
    const CONN = await getConnection();
    const request = CONN.request();
    if (fechaInicio) request.input('fechaInicio', sql.Date, fechaInicio);
    if (fechaFin) request.input('fechaFin', sql.Date, fechaFin);
    request.input('incluirEliminados', sql.Bit, incluirEliminados === 'true' ? 1 : 0);

    const result = await request.execute('SP_GENERAR_REPORTE');
    res.json({
      success: true,
      data: {
        estadisticas: result.recordsets[0][0],
        porTecnico: result.recordsets[1],
        porDia: result.recordsets[2]
      }
    });

  } catch (error) {
    console.error('***Error al generar reporte:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al generar reporte',
      error: error.message 
    });
  }
};