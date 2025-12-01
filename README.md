# Antigravity Lab 🚀

**Mi laboratorio personal de experimentación con IA**

Desarrollado por [lankamar](https://github.com/lankamar)

---

## 🎯 Descripción

Antigravity Lab es una interfaz web interactiva que funciona como un hub central para mis experimentos con Inteligencia Artificial y proyectos de desarrollo. Cuenta con control por voz, integración con extensiones de Chrome, y un sistema de comunicación entre agente y usuario.

## ✨ Características

- **🎙️ Control por Voz**: Comandos de voz en español argentino para navegar y controlar la interfaz
- **📂 Portfolio Dinámico**: Visualización de proyectos con datos actualizables
- **💬 Canal de Comunicación**: Sistema de mensajes entre el agente IA y el usuario
- **🔊 Extensión Lector**: Extensión de Chrome para leer texto seleccionado
- **🌌 Diseño Futurista**: Interfaz con animaciones y efectos visuales tipo cyberpunk

## 🛠️ Tecnologías

- HTML5
- CSS3 (Animaciones y efectos glassmorphism)
- JavaScript Vanilla
- Web Speech API (reconocimiento y síntesis de voz)
- Chrome Extensions API

## 📁 Estructura del Proyecto

```
antigravity_lab/
├── index.html              # Página principal
├── comms.js                # Sistema de mensajes del agente
├── portfolio_data.js       # Datos de proyectos del portfolio
├── lector_extension/       # Extensión de Chrome
│   ├── manifest.json       # Configuración de la extensión
│   └── background.js       # Service worker de la extensión
└── README.md               # Este archivo
```

## 🚀 Uso

### Página Principal

1. Abre `index.html` en tu navegador
2. Haz click en "🎙️ ACTIVAR VOZ" o di "Computadora" para activar los comandos de voz
3. Comandos disponibles:
   - **"hola"** o **"iniciar"**: Saludo y activación del sistema
   - **"proyectos"** o **"mostrar"** o **"repositorio"**: Muestra tus proyectos
   - **"leer mensaje"**: Lee el último mensaje del agente
   - **"experimento"**: Activa una función de demostración

### Extensión del Lector

1. Abre Chrome y ve a `chrome://extensions/`
2. Activa el "Modo de desarrollador"
3. Click en "Cargar extensión sin empaquetar"
4. Selecciona la carpeta `lector_extension`
5. Selecciona cualquier texto en una página web
6. Click derecho > "🔊 Leer esto"

## ⚙️ Configuración

### Personalizar tus Proyectos

Edita el archivo `portfolio_data.js`:

```javascript
const PORTFOLIO_DATA = [
    {
        id: "proyecto-1",
        titulo: "Nombre del Proyecto",
        descripcion: "Descripción breve",
        tags: ["Tecnología 1", "Tecnología 2"],
        link: "URL_del_proyecto"
    }
];
```

### Mensajes del Agente

Edita el archivo `comms.js`:

```javascript
const AGENT_MESSAGES = [
    {
        timestamp: "HH:MM",
        text: "Tu mensaje aquí"
    }
];
```

## 🎨 Personalización

Puedes cambiar los colores editando las variables CSS en `index.html`:

```css
:root {
    --primary: #00f3ff;    /* Color primario (cyan)  */
    --secondary: #bc13fe;  /* Color secundario (violeta) */
    --bg: #0a0a0a;         /* Color de fondo */
    --text: #ffffff;       /* Color de texto */
}
```

## 🔮 Características Futuras

- [ ] Integración con APIs de IA (Gemini, OpenAI)
- [ ] Sistema de autenticación
- [ ] Base de datos para guardar proyectos
- [ ] Más comandos de voz personalizables
- [ ] Panel de administración
- [ ] Sincronización con Google AI Studio
- [ ] Soporte multiidioma

## 📝 Licencia

Este proyecto es personal y está disponible para uso educativo.

## 🤝 Contribuciones

Este es un proyecto personal, pero siempre estoy abierto a sugerencias y feedback.

## 📧 Contacto

- GitHub: [@lankamar](https://github.com/lankamar)
- Email: lankamar@gmail.com

---

**¡Experimentemos con IA juntos! 🚀**
