/**
 * Voice Control System for Antigravity Lab
 * Handles Speech-to-Text, Text-to-Speech, and API Communication
 */

class VoiceManager {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.synth = window.speechSynthesis;
        this.voices = [];
        this.lastMessageCount = 0;

        // Configuration
        this.endpoints = {
            send: '/api/user-message',
            receive: '/api/agent-messages'
        };

        // Bind methods
        this.toggleRecording = this.toggleRecording.bind(this);
        this.handleResult = this.handleResult.bind(this);
        this.handleEnd = this.handleEnd.bind(this);
        this.pollMessages = this.pollMessages.bind(this);

        this.init();
    }

    init() {
        this.setupVoiceRecognition();
        this.loadVoices();

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }

        // Start polling for agent messages
        setInterval(this.pollMessages, 3000);

        console.log('🎤 VoiceManager initialized');
    }

    setupUI() {
        // UI Elements
        this.fabContainer = document.getElementById('voice-fab-container');
        this.micButton = document.getElementById('mic-button');
        this.statusText = document.getElementById('voice-status-text');
        this.waveVisualizer = document.getElementById('voice-wave');

        if (this.micButton) {
            this.micButton.addEventListener('click', this.toggleRecording);
        }

        // Add keyboard shortcut (Spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && e.target === document.body && !this.isListening) {
                e.preventDefault();
                this.toggleRecording();
            }
        });
    }

    setupVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.recognition = new webkitSpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'es-AR'; // Mobile preference

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateUIState('listening');
            };

            this.recognition.onend = this.handleEnd;
            this.recognition.onresult = this.handleResult;
            this.recognition.onerror = (event) => {
                console.error('Voice Error:', event.error);
                this.updateUIState('error');
            };
        } else {
            console.warn('Speech Recognition not supported in this browser');
            if (this.statusText) this.statusText.textContent = "Voz no soportada";
        }
    }

    loadVoices() {
        // Ensure voices are loaded
        window.speechSynthesis.onvoiceschanged = () => {
            this.voices = window.speechSynthesis.getVoices();
        };
    }

    toggleRecording() {
        if (!this.recognition) return;

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    handleEnd() {
        this.isListening = false;
        this.updateUIState('idle');
    }

    handleResult(event) {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('🗣️ Heard:', transcript);

        this.updateUIState('processing');
        this.processCommand(transcript);
        this.sendUserMessage(transcript);
    }

    updateUIState(state) {
        if (!this.fabContainer) return;

        this.fabContainer.className = `voice-fab-container state-${state}`;

        const texts = {
            'idle': 'Click para hablar',
            'listening': 'Escuchando...',
            'processing': 'Procesando...',
            'speaking': 'Hablando...',
            'error': 'Error de micrófono'
        };

        if (this.statusText) {
            this.statusText.textContent = texts[state] || '';
        }

        if (state === 'listening') {
            this.micButton.classList.add('active');
        } else {
            this.micButton.classList.remove('active');
        }
    }

    // --- Logic & API ---

    async processCommand(text) {
        // Local commands for immediate UI feedback
        if (text.includes('proyectos') || text.includes('mostrar') || text.includes('github')) {
            this.scrollToSection('proyectos');
            this.speak('Mostrando sección de proyectos.');
        } else if (text.includes('inicio') || text.includes('hola')) {
            this.scrollToSection('inicio');
            this.speak('Hola, bienvenido al laboratorio.');
        } else if (text.includes('contacto')) {
            this.scrollToSection('contacto');
            this.speak('Vamos a la sección de contacto.');
        } else if (text.includes('presentación') || text.includes('quién sos') || text.includes('intro')) {
            this.playIntro();
        }
    }

    playIntro() {
        const script = "Bienvenido al Antigravity Lab. Soy tu asistente de inteligencia artificial. " +
            "Este es el espacio de trabajo de Marcelo Lancry Kamycki. " +
            "35 años de experiencia clínica evolucionados hacia el desarrollo de software asistido por IA. " +
            "Podés ver los proyectos destacados, la trayectoria, o contactarnos para colaborar. " +
            "Solo decí: proyectos, o contacto.";
        this.speak(script);
    }

    async sendUserMessage(text) {
        try {
            const response = await fetch(this.endpoints.send, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text })
            });
            const data = await response.json();
            console.log('✅ Message sent:', data);
        } catch (error) {
            console.error('❌ Send error:', error);
        }
    }

    async pollMessages() {
        try {
            const response = await fetch(this.endpoints.receive);
            const messages = await response.json();

            if (messages.length > this.lastMessageCount) {
                // New message detected
                if (this.lastMessageCount !== 0) { // Don't speak history on load
                    const latest = messages[messages.length - 1];
                    this.speak(latest.text);
                }
                this.lastMessageCount = messages.length;
            }
        } catch (error) {
            // Silent error for polling
        }
    }

    speak(text) {
        if (this.synth.speaking) {
            this.synth.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-AR';

        // Try to find a good Spanish voice
        const voice = this.voices.find(v => v.lang.includes('es') && v.name.includes('Google'))
            || this.voices.find(v => v.lang.includes('es'));

        if (voice) utterance.voice = voice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onstart = () => this.updateUIState('speaking');
        utterance.onend = () => this.updateUIState('idle');

        this.synth.speak(utterance);
    }

    scrollToSection(id) {
        const element = document.getElementById(id);
        if (element) {
            const offsetTop = element.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }
}

// Initialize
const voiceManager = new VoiceManager();
