document.addEventListener('DOMContentLoaded', () => {
    // --- ESTADO Y CONFIGURACIÓN INICIAL ---
    const initialConfig = {
        text: '3D Impresionante',
        rainbowMode: false,
        textColor: '#F8DB28',
        outlineColor: '#901F06',
        outlineWidth: 3,
        letterSpacing: -0.25,
        shadowColor: '#5E3143',
        shadowLength: 40,
        shadowBlur: 5,
        startAngle: 45,
        endAngle: 135,
        perspectiveArc: 0,
        perspectiveRotate: 0,
        depthIntensity: 5,
        glowEffect: false,
        floatAnimation: false,
        animationSpeed: 6
    };
    let config = { ...initialConfig };

    const presets = {
        deep: { shadowLength: 150, startAngle: 80, endAngle: 100, depthIntensity: 15, perspectiveRotate: 25 },
        neon: { textColor: '#00ffff', outlineColor: '#000000', outlineWidth: 2, shadowColor: '#00ffff', shadowLength: 0, shadowBlur: 15, glowEffect: true },
        elegant: { textColor: '#e0cda7', outlineColor: '#3d2b1f', outlineWidth: 1, shadowLength: 10, shadowBlur: 2, shadowColor: '#000000', startAngle: 90, endAngle: 90 },
        bold: { textColor: '#ffffff', outlineColor: '#000000', outlineWidth: 6, letterSpacing: -0.1, shadowLength: 5, shadowBlur: 1, shadowColor: '#000000' }
    };

    // --- SELECTORES DE ELEMENTOS ---
    const form = document.getElementById('controls-form');
    const shadowHost = document.getElementById('vanish-shadow');
    const demoContainer = document.getElementById('demo-container');
    const copyBtn = document.getElementById('copy-css-button');
    const resetBtn = document.getElementById('reset-button');
    const copyMsg = document.getElementById('copy-message');
    const textColorInput = document.getElementById('text-color');
    const bgButtons = document.querySelectorAll('.bg-btn');
    const presetButtons = document.querySelectorAll('.preset-btn');
    const particlesContainer = document.getElementById('particles');

    // --- LÓGICA PRINCIPAL ---
    let charSpans = [];
    let debounceTimer;

    function handleUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            readConfigFromForm();
            updateText();
        }, 10);
    }
    
    function readConfigFromForm() {
        config.text = form.elements.text.value;
        config.rainbowMode = form.elements.rainbowMode.checked;
        config.textColor = form.elements.textColor.value;
        config.outlineColor = form.elements.outlineColor.value;
        config.outlineWidth = parseFloat(form.elements.outlineWidth.value);
        config.letterSpacing = parseFloat(form.elements.letterSpacing.value);
        config.shadowColor = form.elements.shadowColor.value;
        config.shadowLength = parseInt(form.elements.shadowLength.value);
        config.shadowBlur = parseFloat(form.elements.shadowBlur.value);
        config.startAngle = parseInt(form.elements.startAngle.value);
        config.endAngle = parseInt(form.elements.endAngle.value);
        config.perspectiveArc = parseInt(form.elements.perspectiveArc.value);
        config.perspectiveRotate = parseInt(form.elements.perspectiveRotate.value);
        config.depthIntensity = parseInt(form.elements.depthIntensity.value);
        config.glowEffect = form.elements.glowEffect.checked;
        config.floatAnimation = form.elements.floatAnimation.checked;
        config.animationSpeed = parseInt(form.elements.animationSpeed.value);
    }

    function updateText() {
        const text = config.text || '';
        if (shadowHost.textContent !== text) {
            shadowHost.innerHTML = '';
            charSpans = [];
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.className = 'char';
                if (char === ' ') {
                    span.innerHTML = '&nbsp;';
                } else {
                    span.textContent = char;
                }
                span.style.setProperty('--char-index', index);
                shadowHost.appendChild(span);
                charSpans.push(span);
            });
        }
        applyStyles();
    }
    
    function applyStyles() {
        shadowHost.classList.toggle('rainbow-mode-active', config.rainbowMode);
        textColorInput.disabled = config.rainbowMode;
        shadowHost.style.color = config.rainbowMode ? '' : config.textColor;
        shadowHost.style.webkitTextStroke = `${config.outlineWidth}px ${config.outlineColor}`;
        shadowHost.style.letterSpacing = `${config.letterSpacing}rem`;
        shadowHost.classList.toggle('float-animation', config.floatAnimation);
        shadowHost.style.animationDuration = config.floatAnimation ? `${config.animationSpeed}s` : '';
        apply3DEffects();
        applyShadows();
        updateLabelValues();
    }

    function apply3DEffects() {
        const charCount = charSpans.length;
        if (charCount === 0) return;
        charSpans.forEach((span, index) => {
            const progress = charCount > 1 ? (index - (charCount - 1) / 2) / (charCount / 2) : 0;
            const rotation = progress * config.perspectiveRotate;
            const curvature = -config.perspectiveArc * Math.pow(progress, 2);
            span.style.transform = `rotateY(${rotation}deg) translateY(${curvature}px) translateZ(${Math.abs(progress) * config.depthIntensity}px)`;
            span.style.zIndex = Math.round(charCount - Math.abs(index - (charCount - 1) / 2));
        });
    }

    function applyShadows() {
        const charCount = charSpans.length;
        if (charCount === 0) return;
        charSpans.forEach((span, index) => {
            const progress = charCount > 1 ? index / (charCount - 1) : 0.5;
            const angle = config.startAngle + progress * (config.endAngle - config.startAngle);
            const shadow = generateFadingShadow(angle, config.shadowLength, config.shadowColor, config.shadowBlur, config.glowEffect);
            span.style.textShadow = shadow;
        });
    }

    // --- FUNCIONES DE AYUDA ---
    function generateFadingShadow(angle, length, colorHex, blurBase, addGlow) {
        let shadowParts = [];
        if (addGlow) {
            const glowColor = config.rainbowMode ? 'currentColor' : config.textColor;
            shadowParts.push(`0 0 10px ${glowColor}`, `0 0 20px ${glowColor}`);
        }
        if (length > 0) {
            const [r, g, b] = hexToRgb(colorHex);
            const angleRad = (angle * Math.PI) / 180;
            const xDir = Math.cos(angleRad);
            const yDir = Math.sin(angleRad);
            const steps = Math.min(Math.ceil(length), 80);
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                const currentLength = progress * length;
                const x = (currentLength * xDir).toFixed(2);
                const y = (currentLength * yDir).toFixed(2);
                const opacity = (0.5 * (1 - progress * 0.9)).toFixed(3);
                const blur = (progress * blurBase).toFixed(2);
                shadowParts.push(`${x}px ${y}px ${blur}px rgba(${r},${g},${b},${opacity})`);
            }
        }
        return shadowParts.length > 0 ? shadowParts.join(', ') : 'none';
    }

    function hexToRgb(hex) {
        hex = hex.replace('#', '');
        const bigint = parseInt(hex, 16);
        return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
    }

    function updateLabelValues() {
        document.getElementById('letter-spacing-value').textContent = config.letterSpacing.toFixed(2);
        document.getElementById('outline-width-value').textContent = config.outlineWidth;
        document.getElementById('shadow-length-value').textContent = config.shadowLength;
        document.getElementById('shadow-blur-value').textContent = config.shadowBlur;
        document.getElementById('start-angle-value').textContent = config.startAngle;
        document.getElementById('end-angle-value').textContent = config.endAngle;
        document.getElementById('perspective-arc-value').textContent = config.perspectiveArc;
        document.getElementById('perspective-rotate-value').textContent = config.perspectiveRotate;
        document.getElementById('depth-intensity-value').textContent = config.depthIntensity;
        document.getElementById('animation-speed-value').textContent = config.animationSpeed;
    }

    function updateFormFromConfig() {
        for (const key in config) {
            const el = form.elements[key];
            if (el) { el.type === 'checkbox' ? el.checked = config[key] : el.value = config[key]; }
        }
    }
    
    function generateAndCopyHtml() {
        let charStyles = '', charHtml = '';
        charSpans.forEach((span, i) => {
            charStyles += `
    .epic-title .char:nth-child(${i + 1}) {
        transform: ${span.style.transform};
        text-shadow: ${span.style.textShadow};
        z-index: ${span.style.zIndex};
        --char-index: ${i};
    }`;
            charHtml += `<span class="char">${span.innerHTML}</span>`;
        });

        const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Texto 3D Personalizado</title>
<style>
    body { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: ${demoContainer.style.background || 'linear-gradient(135deg, #1a1a2e, #2c3e50)'}; font-family: sans-serif; overflow-x: hidden; margin: 0; padding: 20px; box-sizing: border-box; }
    .epic-title { font-size: 100px; font-weight: 800; display: flex; justify-content: center; flex-wrap: nowrap; perspective: 500px; color: ${config.rainbowMode ? 'transparent' : config.textColor}; -webkit-text-stroke: ${config.outlineWidth}px ${config.outlineColor}; letter-spacing: ${config.letterSpacing}rem; ${config.floatAnimation ? `animation: float ${config.animationSpeed}s ease-in-out infinite;` : ''} }
    .epic-title .char { display: inline-block; position: relative; transition: transform 0.3s ease; }
    .epic-title .char:hover { transform: translateY(-5px) scale(1.1) !important; }
    ${charStyles}
    ${config.rainbowMode ? `.epic-title.rainbow .char { color: hsl(calc(var(--char-index) * 57), 80%, 60%); animation: rainbow-pulse 3s infinite alternate; } @keyframes rainbow-pulse { to { filter: brightness(1.2) hue-rotate(360deg); } }` : ''}
    ${config.floatAnimation ? `@keyframes float { 50% { transform: translateY(-20px); } }` : ''}
    
    /* --- ESTILOS RESPONSIVOS MEJORADOS --- */
    /* Para Tablets y Escritorios Pequeños */
    @media (max-width: 1200px) {
        .epic-title { font-size: 8vw; }
    }

    /* Para Tablets Pequeñas y Móviles Grandes */
    @media (max-width: 768px) {
        .epic-title {
            font-size: 10vw;
            /* ¡Clave! Permite que las letras pasen a la siguiente línea */
            flex-wrap: wrap;
            /* Añade espacio entre líneas si el texto se envuelve */
            line-height: 1.2;
        }
    }

    /* Para Móviles en vertical */
    @media (max-width: 480px) {
        .epic-title {
            font-size: 12vw;
        }
    }
</style>
</head>
<body>
<h1 class="epic-title ${config.rainbowMode ? 'rainbow' : ''}">${charHtml}</h1>
</body>
</html>`;

        const textarea = document.createElement('textarea');
        textarea.value = htmlContent;
        textarea.style.position = 'fixed';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            copyMsg.textContent = '¡HTML copiado al portapapeles!';
        } catch (err) {
            copyMsg.textContent = 'Error al copiar.';
            console.error('Fallo al copiar: ', err);
        }
        document.body.removeChild(textarea);
        copyMsg.classList.add('visible');
        setTimeout(() => copyMsg.classList.remove('visible'), 2000);
    }

    function handleReset() {
        config = { ...initialConfig };
        updateFormFromConfig();
        handleUpdate();
    }
    
    function createParticles(count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // --- EVENT LISTENERS ---
    form.addEventListener('input', handleUpdate);
    copyBtn.addEventListener('click', generateAndCopyHtml);
    resetBtn.addEventListener('click', handleReset);
    presetButtons.forEach(btn => btn.addEventListener('click', () => { config = { ...config, ...presets[btn.dataset.preset] }; updateFormFromConfig(); handleUpdate(); }));
    bgButtons.forEach(btn => btn.addEventListener('click', () => { bgButtons.forEach(b => b.classList.remove('active')); btn.classList.add('active'); demoContainer.style.background = btn.dataset.bg; }));

    // --- INICIALIZACIÓN ---
    createParticles();
    updateFormFromConfig();
    updateText();
});