const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DATA_DIR = path.join(__dirname, 'data');
const USER_MESSAGES_FILE = path.join(DATA_DIR, 'user_messages.json');
const AGENT_MESSAGES_FILE = path.join(DATA_DIR, 'agent_messages.json');

// Crear carpeta data si no existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Inicializar archivos JSON si no existen
if (!fs.existsSync(USER_MESSAGES_FILE)) {
    fs.writeFileSync(USER_MESSAGES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(AGENT_MESSAGES_FILE)) {
    fs.writeFileSync(AGENT_MESSAGES_FILE, JSON.stringify([], null, 2));
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};


const server = http.createServer((req, res) => {
    console.log(`${req.method} ${req.url}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // API: Guardar mensaje del usuario
    if (req.url === '/api/user-message' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const messages = JSON.parse(fs.readFileSync(USER_MESSAGES_FILE, 'utf8'));

                const newMessage = {
                    timestamp: new Date().toISOString(),
                    text: data.text
                };

                messages.push(newMessage);
                fs.writeFileSync(USER_MESSAGES_FILE, JSON.stringify(messages, null, 2));

                console.log('📥 Mensaje del usuario:', data.text);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: newMessage }));
            } catch (error) {
                console.error('❌ Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // API: Leer mensajes del usuario
    if (req.url === '/api/user-messages' && req.method === 'GET') {
        try {
            const messages = JSON.parse(fs.readFileSync(USER_MESSAGES_FILE, 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(messages));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // API: Guardar respuesta del agente
    if (req.url === '/api/agent-response' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                const messages = JSON.parse(fs.readFileSync(AGENT_MESSAGES_FILE, 'utf8'));

                const timestamp = new Date();
                const timeString = timestamp.toTimeString().slice(0, 5);

                const newMessage = {
                    timestamp: timeString,
                    text: data.text
                };

                messages.push(newMessage);
                fs.writeFileSync(AGENT_MESSAGES_FILE, JSON.stringify(messages, null, 2));

                // También actualizar comms.js para retrocompatibilidad
                const commsContent = `const AGENT_MESSAGES = ${JSON.stringify(messages, null, 4)};\n`;
                fs.writeFileSync(path.join(__dirname, 'comms.js'), commsContent);

                console.log('📤 Respuesta del agente:', data.text);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: newMessage }));
            } catch (error) {
                console.error('❌ Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // API: Leer respuestas del agente
    if (req.url === '/api/agent-messages' && req.method === 'GET') {
        try {
            const messages = JSON.parse(fs.readFileSync(AGENT_MESSAGES_FILE, 'utf8'));
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(messages));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    // API: Subir imagen (Base64)
    if (req.url === '/api/upload-image' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const { filename, imageBase64 } = JSON.parse(body);

                // Remover header de data URL si existe
                const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');

                const filePath = path.join(__dirname, filename);
                fs.writeFileSync(filePath, buffer);

                console.log('🖼️ Imagen guardada:', filename);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: 'Imagen guardada', path: filename }));
            } catch (error) {
                console.error('❌ Error subiendo imagen:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        });
        return;
    }

    // Servir archivos estáticos
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('404 - Archivo no encontrado');
            } else {
                res.writeHead(500);
                res.end('Error interno del servidor: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log('🚀 Antigravity Lab está corriendo en: http://localhost:' + PORT);
    console.log('\n✅ Sistema de comunicación bidireccional activado\n');
    console.log('📡 Endpoints disponibles:');
    console.log('   POST /api/user-message - Enviar mensaje del usuario');
    console.log('   GET  /api/user-messages - Leer mensajes del usuario');
    console.log('   POST /api/agent-response - Guardar respuesta del agente');
    console.log('   GET  /api/agent-messages - Obtener mensajes del agente\n');
});
