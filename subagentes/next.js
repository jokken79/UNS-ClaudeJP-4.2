const { ejecutarComandoLocal, preguntarAlModelo } = require('../utils');

const plantillas = {
  'simple': 'npx create-next-app@latest',
  'tailwind': 'npx create-next-app@latest --example with-tailwindcss'
  // … otras plantillas
};

async function crearProyecto(peticion) {
  // Revisar si coincide con alguna plantilla
  if (peticion.includes('tailwind')) {
    return await ejecutarComandoLocal(plantillas['tailwind']);
  }
  // Si no, preguntar al modelo usando un prompt breve
  const prompt = `Eres un experto en Next.js. ¿Qué comando debo usar para: ${peticion}? Solo el comando, sin explicación.`;
  const comando = await preguntarAlModelo(prompt);
  return await ejecutarComandoLocal(comando);
}

module.exports = { crearProyecto };
