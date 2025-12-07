// Función para enviar mensajes de voz al servidor
function enviarMensajeAlServidor(texto) {
    fetch('/api/user-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: texto })
    })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Mensaje enviado al servidor:', data);
        })
        .catch(error => {
            console.error('❌ Error enviando mensaje:', error);
        });
}

// Interceptar la función procesarComando original
const procesarComandoOriginal = window.procesarComando;
window.procesarComando = function (texto) {
    // Enviar al servidor primero
    enviarMensajeAlServidor(texto);
    // Ejecutar lógica original si existe
    if (procesarComandoOriginal) {
        procesarComandoOriginal(texto);
    }
};
