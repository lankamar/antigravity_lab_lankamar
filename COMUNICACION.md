# 🎙️ Sistema de Comunicación Bidireccional

## ✅ LO QUE YA ESTÁ IMPLEMENTADO

### 1. Servidor con API ExtendidaFile: `server.js`

**Nuevos Endpoints:**
- `POST /api/user-message` - Recibe mensajes del usuario
- `GET /api/user-messages` - Lista todos los mensajes del usuario
- `POST /api/agent-response` - Guarda respuestas del agente
- `GET /api/agent-messages` - Obtiene respuestas del agente

### 2. Almacenamiento Persistente
Carpeta: `data/`
- `user_messages.json` - Mensajes enviados desde la web
- `agent_messages.json` - Respuestas del agente

### 3. Archivos de Datos
- `comms.js` - Mensajes del agente (retrocompatibilidad)
- `portfolio_data.js` - Datos de proyectos
- `voice_bridge.js` - Puente para enviar mensajes al servidor

---

## 🚀 CÓMO USAR EL SISTEMA

### Paso 1: Le Levantamos el Servidor

```bash
cd C:\instalaciones\antigravity_lab
node server.js
```

Deberías ver:
```
🚀 Antigravity Lab está corriendo en: http://localhost:8000

✅ Sistema de comunicación bidireccional activado

📡 Endpoints disponibles:
   POST /api/user-message - Enviar mensaje del usuario
   GET API /api/user-messages - Leer mensajes del usuario   POST /api/agent-response - Guardar respuesta del agente
   GET  /api/agent-messages - Obtener mensajes del agente
```

### Paso 2: Cargar voice_bridge.js en el HTML

**Opción A: Agregarlo manualmente al HTML**
Agregar esta línea después de`<script src="comms.js"></script>`:

```html
<script src="voice_bridge.js"></script>
```

**Opción B: Cargarlo desde la consola del navegador**
1. Abrí `http://localhost:8000`
2. Abrí la consola del navegador (F12)
3. Pegá este código:

```javascript
const script = document.createElement('script');
script.src = 'voice_bridge.js';
document.body.appendChild(script);
console.log('✅ Voice bridge cargado');
```

### Paso 3: Probar el Sistema

**Desde la Web (Usuario):**
1. Clickeá en "🎙️ ACTIVAR VOZ"
2.Decí cualquier cosa por el micrófono
3. El mensaje se guardará automáticamente en `data/user_messages.json`

**Por el Agente (Yo):**
Puedo leer tus mensajes y responder:

```javascript
// Leer mensajes del usuario
fetch('http://localhost:8000/api/user-messages')
    .then(r => r.json())
    .then(msgs => console.log(msgs));

// Enviar respuesta
fetch('http://localhost:8000/api/agent-response', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '¡Recibido! Todo funcionando.' })
});
```

**En la Web (Usuario lee mi respuesta):**
1. Clickeá "🔄 RECIBIR MENSAJE"
2. La interfaz lee mi respuesta en voz alta

---

## 📊 FLUJO COMPLETO

```
Usuario habla por mic
    ↓
voice_bridge.js captura el texto
    ↓
POST /api/user-message
    ↓
Se guarda en data/user_messages.json
    ↓
Agente lee con GET /api/user-messages
    ↓
Agente procesa y responde
    ↓
POST /api/agent-response
    ↓
Se guarda en data/agent_messages.json
    ↓
También actualiza comms.js
    ↓
Usuario clickea "Recibir Mensaje"
    ↓
Web lee desde comms.js
    ↓
Síntesis de voz habla la respuesta
```

---

## 🧪 TESTING MANUAL

### Test 1: Enviar Mensaje desde la Web

```bash
# Desde PowerShell o con cURL:
curl -X POST http://localhost:8000/api/user-message `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"Hola desde PowerShell\"}'
```

### Test 2: Leer Mensajes

```bash
# Ver mensajes del usuario:
curl http://localhost:8000/api/user-messages

# Ver respuestas del agente:
curl http://localhost:8000/api/agent-messages
```

###  Test 3: Agente Responde

```bash
curl -X POST http://localhost:8000/api/agent-response `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"¡Sistema operativo! Te escucho perfecto.\"}'
```

---

## 🔧 PRÓXIMOS PASOS (Opcional)

1. **Integrar voice_bridge.js automáticamente**
   - Agregar `<script src="voice_bridge.js"></script>` al HTML
   
2. **Agregar botón de prueba**
   - Un botón para testear el envío sin usar voz

3. **Auto-poll**
   - Que la web chequee automáticamente cada X segundos si hay mensajes nuevos

4. **Notificaciones visuales**
   - Mostrar un indicador cuando hay mensajes sin leer

---

## 📝 ¿TODO FUNCIONA?

**Checklist:**
- [x] Servidor levantado con endpoints
- [x] Archivos JSON creados en `data/`
- [x] `voice_bridge.js` creado
- [x] `portfolio_data.js` con ejemplos
- [x] `comms.js` con mensaje inicial
- [ ] `voice_bridge.js` cargado en HTML (manual)
- [ ] Probado flujo completo

---

## 🐛 TROUBLESHOOTING

**Problema:** "404 Not Found" al cargar `voice_bridge.js`
**Solución:** Asegurate  que el servidor esté corriendo y el archivo exista

**Problema:** Los mensajes no se guardan
**Solución:** Revisá la consola del servidor, debería mostrar "📥 Mensaje del usuario: ..."

**Problema:** El agente no puede leer mis mensajes
**Solución:** Revisá que `data/user_messages.json`no esté vacío

---

**¿ST PREGUN tas?** Leé el `STATUS.md` principal o probá los comandos de test.
