const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  port: parseInt(process.env.DB_PORT),
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let pool = null;

const getConnection = async () => {
  try {
    if (pool) {
      return pool;
    }
    pool = await sql.connect(config);
    console.log('Conectado a SQL Server');
    return pool;
  } catch (error) {
    console.error('*****Error de conexión a BD:', error);
    throw error;
  }
};

// Cerrar conexión al finalizar
process.on('SIGINT', async () => {
  if (pool) {
    await pool.close();
    console.log('Conexion a SQL Server finalizada');
  }
  process.exit(0);
});

module.exports = { getConnection, sql };