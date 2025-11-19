const bcrypt = require('bcryptjs');

async function generarContrasena() {
    const pass = 'mp123';
    const hash = await bcrypt.hash(pass, 10);//se genera el hash de la contrasena
    
    console.log('\nHash de contrasena para "' + pass + '": ' + hash);
}

generarContrasena();