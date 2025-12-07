// ============================================
// INICIALIZACIÓN
// ============================================
const App = {
    elements: {},
    recognition: null,

    init() {
        this.cacheElements();
        this.setupVoiceRecognition();
        this.attachEventListeners();
        this.renderProjects();
        this.loadLatestMessage();
    },

    cacheElements() {
        this.elements = {
            status: document.getElementById('status'),
            output: document.getElementById('output'),
            voiceIndicator: document.getElementById('voice-indicator'),
            micBtn: document.getElementById('mic-btn'),
            projectsSection: document.getElementById('projects-section'),
            projectsGrid: document.getElementById('projects-grid'),
            messageDisplay: document.getElementById('message-display'),
            refreshMsgBtn: document.getElementById('refresh-msg-btn')
        };
    }
};

// ============================================
// RECONOCIMIENTO DE VOZ
// ============================================
App.setupVoiceRecognition = function () {
    if (!('webkitSpeechRecognition' in window)) {
        this.elements.status.textContent = 'Tu navegador no soporta reconocimiento de voz';
        this.elements.micBtn.disabled = true;
        return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = 'es-AR';
    this.recognition.interimResults = false;

    this.recognition.onstart = () => {
        this.elements.voiceIndicator.classList.add('active');
        this.elements.status.textContent = 'Escuchando comandos...';
    };

    this.recognition.onend = () => {
        this.elements.voiceIndicator.classList.remove('active');
        this.elements.status.textContent = 'Sistema en espera';
    };

    this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        this.handleCommand(transcript);
    };

    this.recognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        this.elements.output.textContent = `Error: ${event.error}`;
    };
};

App.startListening = function () {
    if (this.recognition) {
        this.recognition.start();
    }
};

// ============================================
// PROCESAMIENTO DE COMANDOS
// ============================================
App.handleCommand = function (text) {
    this.elements.output.innerHTML = `<strong>&gt;</strong> Comando recibido: "${text}"`;

    const commands = {
        'hola': () => this.speak('Bienvenido al laboratorio Antigravity. Sistemas listos.'),
        'iniciar': () => this.speak('Sistema iniciado correctamente.'),
        'proyectos': () => this.showProjects(),
        'mostrar': () => this.showProjects(),
        'github': () => this.showProjects(),
        'repositorio': () => this.showProjects(),
        'mensaje': () => this.refreshMessage(),
        'leer': () => this.refreshMessage(),
        'ocultar': () => this.hideProjects()
    };

    // Buscar comando que coincida
    const matchedCommand = Object.keys(commands).find(cmd => text.includes(cmd));

    if (matchedCommand) {
        commands[matchedCommand]();
    } else {
        this.speak('Comando no reconocido. Intenta con: proyectos, mensaje, hola.');
    }
};

// ============================================
// SÍNTESIS DE VOZ
// ============================================
App.speak = function (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-AR';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
};

// ============================================
// GESTIÓN DE PROYECTOS
// ============================================
App.renderProjects = function () {
    if (typeof PORTFOLIO_DATA === 'undefined') {
        console.warn('No se encontró PORTFOLIO_DATA');
        return;
    }

    this.elements.projectsGrid.innerHTML = '';

    PORTFOLIO_DATA.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <h3>[${project.id.toUpperCase()}] ${project.titulo}</h3>
            <p>${project.descripcion}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
        `;
        card.addEventListener('click', () => this.openProject(project));
        this.elements.projectsGrid.appendChild(card);
    });
};

App.showProjects = function () {
    this.elements.projectsSection.classList.add('visible');
    this.speak('Accediendo a la base de datos. Desplegando proyectos.');
};

App.hideProjects = function () {
    this.elements.projectsSection.classList.remove('visible');
    this.speak('Ocultando proyectos.');
};

App.openProject = function (project) {
    this.speak(`Abriendo detalles del proyecto ${project.titulo}`);
    this.elements.output.innerHTML = `
        <strong>Proyecto seleccionado:</strong><br>
        ${project.titulo}<br>
        <em>${project.descripcion}</em>
    `;
};

// ============================================
// SISTEMA DE MENSAJES
// ============================================
App.loadLatestMessage = function () {
    if (typeof AGENT_MESSAGES === 'undefined' || AGENT_MESSAGES.length === 0) {
        return;
    }

    const latest = AGENT_MESSAGES[AGENT_MESSAGES.length - 1];
    this.displayMessage(latest);
};

App.displayMessage = function (message) {
    this.elements.messageDisplay.innerHTML = `
        <strong>[${message.timestamp}]</strong><br>
        &gt;&gt; ${message.text}
    `;
};

App.refreshMessage = function () {
    // Recargar el script de comms.js
    const oldScript = document.querySelector('script[src="comms.js"]');
    if (oldScript) oldScript.remove();

    const newScript = document.createElement('script');
    newScript.src = `comms.js?t=${Date.now()}`;
    newScript.onload = () => {
        this.loadLatestMessage();
        if (typeof AGENT_MESSAGES !== 'undefined' && AGENT_MESSAGES.length > 0) {
            const text = AGENT_MESSAGES[AGENT_MESSAGES.length - 1].text;
            this.speak(text);
        }
    };
    document.body.appendChild(newScript);
};

// ============================================
// EVENT LISTENERS
// ============================================
App.attachEventListeners = function () {
    this.elements.micBtn.addEventListener('click', () => this.startListening());
    this.elements.refreshMsgBtn.addEventListener('click', () => this.refreshMessage());

    // Atajo de teclado: Espacio para activar micrófono
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            this.startListening();
        }
    });
};

// ============================================
// ARRANQUE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
    console.log('🚀 Antigravity Lab iniciado correctamente');
});
