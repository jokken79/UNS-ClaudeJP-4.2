const { ejecutarComandoLocal, preguntarAlModelo } = require('../utils');

// Plantillas y reglas locales para RRHH
const plantillasRRHH = {
  'contrato_basico': 'Plantilla de contrato laboral estándar conforme a la Ley de Normas Laborales de Japón',
  'checklist_visa': 'Lista de documentos para verificar la residencia y visa de trabajo'
  // … otras plantillas y checklists
};

async function manejarRRHH(peticion) {
  // Identificar si es una solicitud de plantilla
  if (peticion.includes('contrato')) {
    // Devolver la plantilla local para contratos
    return plantillasRRHH['contrato_basico'];
  }
  if (peticion.includes('visa')) {
    // Proporcionar checklist local de verificación de visa
    return plantillasRRHH['checklist_visa'];
  }
  // Si es una consulta específica que no está en la caché, preguntar al modelo
  const prompt = `Eres asesor legal de Recursos Humanos en Japón. Proporciona de forma resumida información sobre: ${peticion}. Sé específico, no tomes decisiones y recuerda la Ley de Normas Laborales y la Ley de Inmigración.`;
  const respuesta = await preguntarAlModelo(prompt);
  return respuesta;
}

module.exports = { manejarRRHH };
