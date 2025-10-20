const { ejecutarComandoLocal, preguntarAlModelo } = require('./utils');
const subagenteNext = require('./subagentes/next');
const subagenteSQL = require('./subagentes/sql');
const subagenteRRHH = require('./subagentes/rrhh');

async function orquestar(peticion) {
  // Simplificar la petición para decidir qué hacer
  if (peticion.match(/(crear|iniciar) proyecto next/i)) {
    return await subagenteNext.crearProyecto(peticion);
  }
  if (peticion.match(/(crear|modificar) tabla/i)) {
    return await subagenteSQL.manejarSQL(peticion);
  }
  if (peticion.match(/(contratar|empleo|visa|trabajador|personal)/i)) {
    return await subagenteRRHH.manejarRRHH(peticion);
  }
  // Fall back: preguntar al modelo con un prompt mínimo
  const prompt = `Eres un asistente de programación. Resume en un comando la siguiente petición: ${peticion}`;
  const respuesta = await preguntarAlModelo(prompt);
  return await ejecutarComandoLocal(respuesta);
}

module.exports = { orquestar };
