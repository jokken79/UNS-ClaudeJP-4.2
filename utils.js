async function preguntarAlModelo(prompt) {
  // Llamada al modelo: solo envía el prompt y recoge la respuesta
  // Aquí se consumen tokens
  // Implementa la llamada a tu proveedor de IA
  return 'comando_de_ejemplo';
}

async function ejecutarComandoLocal(comando) {
  // Ejecuta el comando en el sistema (por ejemplo con Node's child_process)
  console.log('Ejecutando:', comando);
  // Aquí no se consumen tokens, es lógica local
  return 'resultado_de_ejemplo';
}

module.exports = { preguntarAlModelo, ejecutarComandoLocal };
