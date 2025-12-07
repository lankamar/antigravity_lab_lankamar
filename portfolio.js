// ============================================
// NAVEGACIÓN MÓVIL
// ============================================
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

// ============================================
// NAVEGACIÓN STICKY CON CAMBIO DE COLOR
// ============================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// ANIMACIONES DE ENTRADA (AOS-like)
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos con data-aos
document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ============================================
// EFECTOS DE HOVER EN TARJETAS DE PROYECTO
// ============================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function (e) {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function (e) {
        this.style.transform = 'translateY(0) scale(1)';
    });

    // Efecto de seguimiento del mouse
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
});

// ============================================
// BOTÓN DE FAVORITO
// ============================================
document.querySelectorAll('.project-fav').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const svg = this.querySelector('svg path');
        const isFilled = svg.getAttribute('fill') !== 'none';

        if (isFilled) {
            svg.setAttribute('fill', 'none');
            this.style.color = 'var(--text-secondary)';
        } else {
            svg.setAttribute('fill', 'currentColor');
            this.style.color = 'var(--accent)';

            // Animación de "me gusta"
            this.style.transform = 'scale(1.3)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        }
    });
});

// ============================================
// FORMULARIO DE CONTACTO
// ============================================
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('.btn-primary');
        const originalText = submitBtn.innerHTML;

        // Mostrar estado de carga
        submitBtn.innerHTML = '<span>Enviando...</span>';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';

        // Simular envío (aquí integrarías tu backend)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Mostrar éxito
        submitBtn.innerHTML = '✓ <span>Mensaje Enviado</span>';
        submitBtn.style.background = 'linear-gradient(135deg, #00ff88, #00cc66)';

        // Resetear formulario
        setTimeout(() => {
            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
            submitBtn.style.background = '';
        }, 3000);

        // Aquí irías tu lógica de envío real
        // const formData = new FormData(contactForm);
        // const response = await fetch('/api/contact', { method: 'POST', body: formData });
    });
}

// ============================================
// IMAGEN DE PERFIL - PLACEHOLDER O GENERADA
// ============================================
const profileImg = document.getElementById('profile-photo');

// Lista de posibles imágenes (modificar con tu ruta real)
const profileImages = [
    'profile.png',
    'profile.jpg',
    'assets/profile.jpg',
    'assets/profile.png'
];


// Intentar cargar la imagen del perfil
async function loadProfileImage() {
    // Primero intentar cargar desde las rutas definidas
    for (const imgPath of profileImages) {
        try {
            const response = await fetch(imgPath, { method: 'HEAD' });
            if (response.ok) {
                profileImg.src = imgPath;
                return;
                if (profileContainer && profileUpload) {
                    profileContainer.addEventListener('click', () => {
                        profileUpload.click();
                    });

                    profileUpload.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            const base64String = reader.result;
                            const filename = 'profile.png'; // Force standardized name

                            // Optimistic UI update
                            profileImg.src = base64String;

                            try {
                                const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        filename: filename,
                                        imageBase64: base64String
                                    })
                                });

                                const result = await response.json();
                                if (result.success) {
                                    console.log('✅ Imagen actualizada');
                                    // Force refresh to bypass cache
                                    profileImg.src = `${filename}?t=${new Date().getTime()}`;
                                } else {
                                    console.error('❌ Error subiendo:', result.error);
                                }
                            } catch (err) {
                                console.error('❌ Error de red:', err);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }

                loadProfileImage();

                // ============================================
                // PROJECT & GALLERY IMAGE UPLOADS
                // ============================================
                function setupImageUpload(containerId, imgId, uploadId, filename) {
                    const container = document.getElementById(containerId);
                    const img = document.getElementById(imgId);
                    const upload = document.getElementById(uploadId);

                    if (!container || !upload) return;

                    // Try to load existing image
                    fetch(`uploads/${filename}`, { method: 'HEAD' })
                        .then(res => {
                            if (res.ok) img.src = `uploads/${filename}?t=${Date.now()}`;
                        })
                        .catch(() => { });

                    container.addEventListener('click', () => upload.click());

                    upload.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            img.src = reader.result;

                            try {
                                const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        filename: `uploads/${filename}`,
                                        imageBase64: reader.result
                                    })
                                });
                                const result = await response.json();
                                if (result.success) {
                                    console.log(`✅ ${filename} guardada`);
                                    img.src = `uploads/${filename}?t=${Date.now()}`;
                                }
                            } catch (err) {
                                console.error('❌ Error:', err);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }

                // Setup project images
                setupImageUpload('project1-container', 'project1-img', 'project1-upload', 'project1.jpg');
                setupImageUpload('project2-container', 'project2-img', 'project2-upload', 'project2.jpg');
                setupImageUpload('project3-container', 'project3-img', 'project3-upload', 'project3.jpg');

                // Setup gallery images
                setupImageUpload('gallery1-container', 'gallery1-img', 'gallery1-upload', 'gallery1.jpg');
                setupImageUpload('gallery2-container', 'gallery2-img', 'gallery2-upload', 'gallery2.jpg');
                setupImageUpload('gallery3-container', 'gallery3-img', 'gallery3-upload', 'gallery3.jpg');
                setupImageUpload('gallery4-container', 'gallery4-img', 'gallery4-upload', 'gallery4.jpg');
                setupImageUpload('gallery5-container', 'gallery5-img', 'gallery5-upload', 'gallery5.jpg');
                setupImageUpload('gallery6-container', 'gallery6-img', 'gallery6-upload', 'gallery6.jpg');

                // Setup social media images
                setupImageUpload('youtube-container', 'youtube-img', 'youtube-upload', 'youtube.jpg');
                setupImageUpload('tiktok-container', 'tiktok-img', 'tiktok-upload', 'tiktok.jpg');
                setupImageUpload('instagram-container', 'instagram-img', 'instagram-upload', 'instagram.jpg');

                // Setup podcast images
                setupImageUpload('podcast1-container', 'podcast1-img', 'podcast1-upload', 'podcast1.jpg');
                setupImageUpload('podcast2-container', 'podcast2-img', 'podcast2-upload', 'podcast2.jpg');
                setupImageUpload('podcast3-container', 'podcast3-img', 'podcast3-upload', 'podcast3.jpg');

                // ============================================
                // PODCAST AUDIO UPLOADS
                // ============================================
                function setupAudioUpload(audioId, uploadId, filename) {
                    const audio = document.getElementById(audioId);
                    const upload = document.getElementById(uploadId);

                    if (!audio || !upload) return;

                    // Try to load existing audio
                    fetch(`uploads/${filename}`, { method: 'HEAD' })
                        .then(res => {
                            if (res.ok) audio.src = `uploads/${filename}`;
                        })
                        .catch(() => { });

                    upload.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            audio.src = reader.result;

                            try {
                                const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        filename: `uploads/${filename}`,
                                        imageBase64: reader.result
                                    })
                                });
                                const result = await response.json();
                                if (result.success) {
                                    console.log(`✅ ${filename} guardado`);
                                    audio.src = `uploads/${filename}?t=${Date.now()}`;
                                }
                            } catch (err) {
                                console.error('❌ Error:', err);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }

                setupAudioUpload('podcast1-audio', 'podcast1-audio-upload', 'podcast1.mp3');
                setupAudioUpload('podcast2-audio', 'podcast2-audio-upload', 'podcast2.mp3');
                setupAudioUpload('podcast3-audio', 'podcast3-audio-upload', 'podcast3.mp3');

                // ============================================
                // SMOOTH SCROLL MEJORADO
                // ============================================
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));

                        if (target) {
                            const offsetTop = target.offsetTop - 80; // Altura del navbar

                            window.scrollTo({
                                top: offsetTop,
                                behavior: 'smooth'
                            });
                        }
                    });
                });

                // ============================================
                // CURSOR PERSONALIZADO (OPCIONAL)
                // ============================================
                const cursor = document.createElement('div');
                cursor.className = 'custom-cursor';
                cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(0, 243, 255, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.15s ease;
    display: none;
`;
                document.body.appendChild(cursor);

                // Activar solo en desktop
                if (window.innerWidth > 768) {
                    cursor.style.display = 'block';

                    document.addEventListener('mousemove', (e) => {
                        cursor.style.left = e.clientX - 10 + 'px';
                        cursor.style.top = e.clientY - 10 + 'px';
                    });

                    // Agrandar cursor en elementos clicables
                    document.querySelectorAll('a, button, .project-card').forEach(el => {
                        el.addEventListener('mouseenter', () => {
                            cursor.style.transform = 'scale(2)';
                            cursor.style.backgroundColor = 'rgba(0, 243, 255, 0.1)';
                        });

                        el.addEventListener('mouseleave', () => {
                            cursor.style.transform = 'scale(1)';
                            cursor.style.backgroundColor = 'transparent';
                        });
                    });
                }

                // ============================================
                // ESTADÍSTICAS DE SCROLL
                // ============================================
                const updateScrollProgress = () => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;

                    // Puedes agregar una barra de progreso si quieres
                    // progressBar.style.width = scrolled + "%";
                };

                window.addEventListener('scroll', updateScrollProgress);

                // ============================================
                // EFECTOS DE PARALLAX SUAVES
                // ============================================
                window.addEventListener('scroll', () => {
                    const scrolled = window.pageYOffset;

                    // Parallax en hero
                    const hero = document.querySelector('.hero');
                    if (hero) {
                        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
                        hero.style.opacity = 1 - (scrolled / 600);
                    }

                    // Parallax en badges flotantes
                    document.querySelectorAll('.floating-badge').forEach((badge, index) => {
                        const speed = 0.1 + (index * 0.05);
                        badge.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                });

                // ============================================
                // TYPING EFFECT EN HERO (OPCIONAL)
                // ============================================
                const typeWriter = (element, text, speed = 50) => {
                    let i = 0;
                    element.textContent = '';

                    const type = () => {
                        if (i < text.length) {
                            element.textContent += text.charAt(i);
                            i++;
                            setTimeout(type, speed);
                        }
                    };

                    type();
                };

                // Descomentar si quieres efecto de escritura
                // const subtitle = document.querySelector('.hero-subtitle');
                // if (subtitle) {
                //     const originalText = subtitle.textContent;
                //     setTimeout(() => typeWriter(subtitle, originalText, 30), 500);
                // }

                // ============================================
                // PRELOADER (OPCIONAL)
                // ============================================
                window.addEventListener('load', () => {
                    document.body.classList.add('loaded');

                    // Fade in de elementos
                    setTimeout(() => {
                        document.querySelectorAll('.hero-content > *').forEach((el, index) => {
                            setTimeout(() => {
                                el.style.opacity = '1';
                                el.style.transform = 'translateY(0)';
                            }, index * 100);
                        });
                    }, 200);
                });

                // ============================================
                // LOGGER DE EVENTOS (para debugging)
                // ============================================
                if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                    console.log('%c🚀 Portfolio cargado correctamente', 'font-size: 16px; color: #00f3ff; font-weight: bold;');
                    console.log('%cHecho con ❤️ y código agéntico', 'font-size: 12px; color: #bc13fe;');
                }

                // ============================================
                // AUDIO INTRO PLAYER
                // ============================================
                const playIntroBtn = document.getElementById('play-intro-btn');
                const introAudio = document.getElementById('intro-audio');
                const playIcon = document.querySelector('.play-icon');
                const pauseIcon = document.querySelector('.pause-icon');
                const introAudioUpload = document.getElementById('intro-audio-upload');

                if (playIntroBtn && introAudio) {
                    playIntroBtn.addEventListener('click', () => {
                        if (introAudio.paused) {
                            introAudio.play();
                            playIcon.style.display = 'none';
                            pauseIcon.style.display = 'block';
                        } else {
                            introAudio.pause();
                            playIcon.style.display = 'block';
                            pauseIcon.style.display = 'none';
                        }
                    });

                    introAudio.addEventListener('ended', () => {
                        playIcon.style.display = 'block';
                        pauseIcon.style.display = 'none';
                    });
                }

                if (introAudioUpload) {
                    introAudioUpload.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const reader = new FileReader();
                        reader.onloadend = async () => {
                            introAudio.src = reader.result;

                            try {
                                const response = await fetch('/api/upload-image', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        filename: 'uploads/presentacion.mp3',
                                        imageBase64: reader.result
                                    })
                                });
                                const result = await response.json();
                                if (result.success) {
                                    console.log('Audio de presentacion guardado');
                                    introAudio.src = 'uploads/presentacion.mp3?t=' + Date.now();
                                }
                            } catch (err) {
                                console.error('Error:', err);
                            }
                        };
                        reader.readAsDataURL(file);
                    });
                }
