const { ejecutarComandoLocal, preguntarAlModelo } = require('../utils');

async function manejarSQL(peticion) {
  // Aquí podrías tener reglas locales, p.ej. para crear tabla clientes
  if (peticion.includes('clientes')) {
    const sql = `CREATE TABLE IF NOT EXISTS clientes (id SERIAL PRIMARY KEY, nombre TEXT, correo TEXT);`;
    return await ejecutarComandoLocal(`psql -c "${sql}"`);
  }
  // Si es una consulta compleja, preguntar al modelo con un prompt conciso
  const prompt = `Eres un DBA de PostgreSQL. Responde con la consulta SQL para: ${peticion}`;
  const sql = await preguntarAlModelo(prompt);
  return await ejecutarComandoLocal(`psql -c "${sql}"`);
}

module.exports = { manejarSQL };
