// ========================================
//  ESTADO Y CONFIGURACIÓN INICIAL
// ========================================
const initialConfig = {
    text: 'Dulce!',
    rainbowMode: false,
    textColor: '#F8DB28',
    outlineColor: '#901F06',
    outlineWidth: 3,
    letterSpacing: -0.25,
    shadowColor: '#5E3143',
    shadowLength: 4,
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

// Presets para los botones rápidos
const presets = {
    deep: {
        text: "Profundo",
        shadowLength: 150,
        startAngle: 80,
        endAngle: 100,
        depthIntensity: 15,
        perspectiveRotate: 25,
        letterSpacing: -0.1,
        outlineWidth: 1,
        textColor: '#A0E7E5',
        shadowColor: '#000000',
        outlineColor: '#333'
    },
    neon: {
        text: "Neón",
        textColor: '#00ffff',
        outlineColor: '#000000',
        outlineWidth: 2,
        letterSpacing: 0.1,
        shadowColor: '#00ffff',
        shadowLength: 0, // Sin sombra larga en este preset
        shadowBlur: 15,
        glowEffect: true,
        floatAnimation: true,
        animationSpeed: 4,
    },
    elegant: {
        text: "Elegante",
        textColor: '#e0cda7',
        outlineColor: '#3d2b1f',
        outlineWidth: 1,
        letterSpacing: 0,
        shadowLength: 10,
        shadowBlur: 2,
        shadowColor: '#000000',
        startAngle: 90,
        endAngle: 90,
        depthIntensity: 6,
        perspectiveRotate: -5
    },
    bold: {
        text: "Negrita",
        textColor: '#ffffff',
        outlineColor: '#000000',
        outlineWidth: 6,
        letterSpacing: -0.1,
        shadowLength: 5,
        shadowBlur: 1,
        shadowColor: '#000000',
        depthIntensity: 3
    },
    candy: {
        text: "Dulce",
        textColor: '#ff69b4', // Rosa
        outlineColor: '#8a2be2', // Violeta
        outlineWidth: 4,
        letterSpacing: 0.5,
        shadowLength: 10,
        shadowBlur: 5,
        shadowColor: '#ffc0cb', // Rosa claro
        startAngle: 0,
        endAngle: 180,
        depthIntensity: 8,
        perspectiveRotate: 15,
        glowEffect: true,
        animationSpeed: 3
    },
    metal: {
        text: "Metal",
        textColor: '#c0c0c0', // Plata
        outlineColor: '#808080', // Gris
        outlineWidth: 2,
        letterSpacing: -0.2,
        shadowLength: 20,
        shadowBlur: 8,
        shadowColor: '#404040', // Gris oscuro
        startAngle: 60,
        endAngle: 120,
        depthIntensity: 12,
        perspectiveRotate: 10,
        floatAnimation: true,
        animationSpeed: 5
    },
    retro: {
        text: "Retro",
        textColor: '#ffff00', // Amarillo brillante
        outlineColor: '#ff00ff', // Magenta
        outlineWidth: 5,
        letterSpacing: 0.2,
        shadowLength: 25,
        shadowBlur: 10,
        shadowColor: '#ff4500', // Naranja
        startAngle: 20,
        endAngle: 160,
        depthIntensity: 10,
        perspectiveRotate: -15,
        glowEffect: true,
        animationSpeed: 4
    },
    galaxy: {
        text: "Galaxia",
        textColor: '#ffffff',
        outlineColor: '#483D8B', // DarkSlateBlue
        outlineWidth: 2,
        letterSpacing: 0.1,
        shadowLength: 0, // Sin sombra alargada
        shadowBlur: 20,
        shadowColor: '#8A2BE2', // BlueViolet
        startAngle: 0,
        endAngle: 360,
        depthIntensity: 7,
        perspectiveRotate: 0,
        glowEffect: true,
        floatAnimation: true,
        animationSpeed: 8
    },
    gradient: {
        text: "Gradiente",
        textColor: '#ffffff', // Predominantemente blanco, el gradiente se aplicará visualmente
        outlineColor: '#000000',
        outlineWidth: 1,
        letterSpacing: 0.1,
        shadowLength: 5,
        shadowBlur: 10,
        shadowColor: '#777',
        startAngle: 90,
        endAngle: 90,
        depthIntensity: 6,
        perspectiveRotate: 0,
        glowEffect: true,
        animationSpeed: 5,
    }
};

// ========================================
//  SELECTORES DE ELEMENTOS DEL DOM
// ========================================
const form = document.getElementById('controls-form');
const shadowHost = document.getElementById('vanish-shadow');
const demoContainer = document.getElementById('demo-container');
const copyBtn = document.getElementById('copy-css-button');
const resetBtn = document.getElementById('reset-button');
const randomBtn = document.getElementById('random-button'); // Selector para el nuevo botón
const copyMsg = document.getElementById('copy-message');
const textColorInput = document.getElementById('text-color');
const bgButtons = document.querySelectorAll('.bg-btn');
const presetButtons = document.querySelectorAll('.preset-btn');
const particlesContainer = document.getElementById('particles');

// Variables para la lógica del script
let charSpans = []; // Almacena los spans de cada carácter para aplicar transformaciones 3D
let debounceTimer; // Para controlar la frecuencia de actualización de estilos

// ========================================
//  FUNCIONES DE CONFIGURACIÓN Y ACTUALIZACIÓN
// ========================================

/**
 * Lee los valores actuales de todos los controles del formulario
 * y los guarda en el objeto 'config'.
 */
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

/**
 * Crea los elementos <span> para cada carácter del texto.
 * Esto es necesario para poder aplicar transformaciones 3D individuales.
 */
function updateTextDisplay() {
    const text = config.text || '';
    // Si el texto ha cambiado, recrea los spans de los caracteres
    if (shadowHost.textContent.trim() !== text.trim()) {
        shadowHost.innerHTML = ''; // Limpia el contenido anterior
        charSpans = []; // Reinicia el array de spans
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.className = 'char';
            // Usa &nbsp; para los espacios para que se mantengan visibles
            span.innerHTML = char === ' ' ? '&nbsp;' : char;
            span.style.setProperty('--char-index', index); // Para el modo arcoíris
            shadowHost.appendChild(span);
            charSpans.push(span);
        });
    }
    applyStyles(); // Aplica todos los estilos después de actualizar los caracteres
}

/**
 * Aplica todos los estilos configurados al elemento #vanish-shadow
 * y sus caracteres, basándose en el objeto 'config'.
 */
function applyStyles() {
    // Estilos generales del texto
    shadowHost.style.color = config.rainbowMode ? '' : config.textColor; // Si es arcoíris, el color lo define el CSS dinámico
    shadowHost.style.webkitTextStroke = `${config.outlineWidth}px ${config.outlineColor}`;
    shadowHost.style.letterSpacing = `${config.letterSpacing}rem`;
    shadowHost.classList.toggle('rainbow-mode-active', config.rainbowMode);
    shadowHost.classList.toggle('float-animation', config.floatAnimation);
    shadowHost.style.animationDuration = config.floatAnimation ? `${config.animationSpeed}s` : '';

    // Activa/desactiva el input de color de texto si el arcoíris está activo
    textColorInput.disabled = config.rainbowMode;

    // Clases para efectos especiales
    shadowHost.classList.toggle('glow', config.glowEffect);

    // Aplica transformaciones 3D a cada carácter
    apply3DEffects();

    // Aplica las sombras (efecto 3D y sombra general)
    applyShadows();

    // Actualiza los valores numéricos mostrados al lado de los sliders
    updateLabelValues();
}

/**
 * Aplica las transformaciones 3D (rotación, curvatura, profundidad) a cada carácter.
 */
function apply3DEffects() {
    const charCount = charSpans.length;
    if (charCount === 0) return;

    // El factor de progreso va de -1 a 1 (centro es 0)
    const centerIndex = (charCount - 1) / 2;
    const maxOffset = charCount > 1 ? (charCount - 1) / 2 : 1; // Evita división por cero

    charSpans.forEach((span, index) => {
        const progress = (index - centerIndex) / maxOffset; // Progreso de -1 a 1

        // Rotación Y (de lado a lado)
        const rotationY = progress * config.perspectiveRotate;
        // Curvatura (basada en una parábola, más pronunciada en los extremos)
        const curvature = -config.perspectiveArc * Math.pow(progress, 2);
        // Profundidad (z-index y translateZ)
        const depthTranslateZ = Math.abs(progress) * config.depthIntensity;

        span.style.transform = `rotateY(${rotationY}deg) translateY(${curvature}px) translateZ(${depthTranslateZ}px)`;
        // El z-index ayuda a asegurar el orden correcto en perspectiva, aunque translateZ es más importante
        span.style.zIndex = Math.round(charCount - Math.abs(index - centerIndex));
    });
}

/**
 * Aplica las sombras a cada carácter, simulando el efecto 3D y el resplandor.
 */
function applyShadows() {
    const charCount = charSpans.length;
    if (charCount === 0) return;

    // El progreso va de 0 a 1 (de izquierda a derecha)
    const centerIndex = (charCount - 1) / 2; // Índice del carácter central

    charSpans.forEach((span, index) => {
        // El progreso se ajusta ligeramente para que el efecto de sombra vaya de forma más suave a través del texto
        const progress = charCount > 1 ? (index - centerIndex) / (charCount - 1) : 0;
        const angle = config.startAngle + progress * (config.endAngle - config.startAngle);
        const shadow = generateFadingShadow(angle, config.shadowLength, config.shadowColor, config.shadowBlur, config.glowEffect);
        span.style.textShadow = shadow;
    });
}

/**
 * Genera la cadena de texto para la propiedad `text-shadow` basándose en los parámetros.
 * Simula un efecto de "sombra que se desvanece" a lo largo de una longitud y ángulo dados.
 * @param {number} angle - Ángulo de la sombra en grados.
 * @param {number} length - Distancia total de la sombra.
 * @param {string} colorHex - Color base de la sombra en formato hexadecimal.
 * @param {number} blurBase - Factor base para el desenfoque.
 * @param {boolean} addGlow - Si se debe añadir un efecto de resplandor.
 * @returns {string} - La cadena CSS para text-shadow.
 */
function generateFadingShadow(angle, length, colorHex, blurBase, addGlow) {
    let shadowParts = [];
    if (addGlow) {
        // El color del glow depende del color base del texto o del modo arcoíris
        const glowColor = config.rainbowMode ? 'currentColor' : config.textColor;
        shadowParts.push(`0 0 10px ${glowColor}`, `0 0 20px ${glowColor}`);
    }

    if (length > 0) {
        const [r, g, b] = hexToRgb(colorHex);
        const angleRad = (angle * Math.PI) / 180;
        const xDir = Math.cos(angleRad);
        const yDir = Math.sin(angleRad);
        const steps = Math.min(Math.ceil(length), 80); // Genera hasta 80 "capas" de sombra

        for (let i = 1; i <= steps; i++) {
            const progress = i / steps; // Progreso de la sombra (0 a 1)
            const currentLength = progress * length;
            const x = (currentLength * xDir).toFixed(2);
            const y = (currentLength * yDir).toFixed(2);
            // La opacidad disminuye a medida que la sombra se aleja
            const opacity = (0.6 * (1 - progress * 0.9)).toFixed(3); // Empieza con opacidad más alta
            // El desenfoque aumenta con la distancia
            const blur = (progress * blurBase).toFixed(2);
            shadowParts.push(`${x}px ${y}px ${blur}px rgba(${r},${g},${b},${opacity})`);
        }
    }
    // Devuelve las partes de la sombra separadas por comas, o 'none' si no hay sombras
    return shadowParts.length > 0 ? shadowParts.join(', ') : 'none';
}

/**
 * Convierte un color hexadecimal a un array RGB [r, g, b].
 * @param {string} hex - El color hexadecimal (ej. '#F8DB28').
 * @returns {Array<number>} - El array RGB.
 */
function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/**
 * Actualiza los valores numéricos mostrados al lado de los sliders.
 */
function updateLabelValues() {
    const letterSpacingValue = document.getElementById('letter-spacing-value');
    if (letterSpacingValue) letterSpacingValue.textContent = config.letterSpacing.toFixed(2);

    const outlineWidthValue = document.getElementById('outline-width-value');
    if (outlineWidthValue) outlineWidthValue.textContent = config.outlineWidth;

    const shadowLengthValue = document.getElementById('shadow-length-value');
    if (shadowLengthValue) shadowLengthValue.textContent = config.shadowLength;

    const shadowBlurValue = document.getElementById('shadow-blur-value');
    if (shadowBlurValue) shadowBlurValue.textContent = config.shadowBlur;

    const startAngleValue = document.getElementById('start-angle-value');
    if (startAngleValue) startAngleValue.textContent = config.startAngle;

    const endAngleValue = document.getElementById('end-angle-value');
    if (endAngleValue) endAngleValue.textContent = config.endAngle;

    const perspectiveArcValue = document.getElementById('perspective-arc-value');
    if (perspectiveArcValue) perspectiveArcValue.textContent = config.perspectiveArc;

    const perspectiveRotateValue = document.getElementById('perspective-rotate-value');
    if (perspectiveRotateValue) perspectiveRotateValue.textContent = config.perspectiveRotate;

    const depthIntensityValue = document.getElementById('depth-intensity-value');
    if (depthIntensityValue) depthIntensityValue.textContent = config.depthIntensity;

    const animationSpeedValue = document.getElementById('animation-speed-value');
    if (animationSpeedValue) animationSpeedValue.textContent = config.animationSpeed;
}

/**
 * Actualiza el formulario HTML para que refleje el estado actual del objeto 'config'.
 * Útil para aplicar presets o restaurar la configuración.
 */
function updateFormFromConfig() {
    for (const key in config) {
        const el = form.elements[key];
        if (el) {
            if (el.type === 'checkbox') {
                el.checked = config[key];
            } else {
                el.value = config[key];
            }
            // Actualizar la visualización del valor del slider
            if (el.type === 'range') {
                const valueDisplay = document.getElementById(`${el.id}-value`);
                if (valueDisplay) {
                    let value = el.value;
                    // Añadir unidades si son necesarias
                    if (el.id === 'animation-speed') value += 's';
                    else if (el.id.includes('angle') || el.id === 'perspective-rotate') value += '°';
                    else if (el.id.includes('width') || el.id.includes('length') || el.id.includes('blur') || el.id.includes('intensity') || el.id.includes('arc')) value += 'px';
                    valueDisplay.textContent = value;
                }
            }
        }
    }
    // Si el arcoíris está activado, desactiva el input de color de texto
    textColorInput.disabled = config.rainbowMode;
}

/**
 * Genera el HTML completo para copiar, incluyendo estilos para el texto 3D.
 */
function generateAndCopyHtml() {
    let charStyles = '';
    charSpans.forEach((span, i) => {
        // Extraer estilos relevantes de los spans de caracteres
        charStyles += `
    .epic-title .char:nth-child(${i + 1}) {
        transform: ${span.style.transform};
        text-shadow: ${span.style.textShadow};
        z-index: ${span.style.zIndex};
        --char-index: ${i}; /* Para el modo arcoíris */
    }`;
    });

    // Construye el HTML completo a copiar
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Texto 3D Personalizado</title>
<style>
    /* Estilos básicos para centrar y fondo */
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: ${demoContainer.style.background || 'linear-gradient(135deg, #1a1a2e, #2c3e50)'}; /* Usa el fondo actual o uno por defecto */
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overflow-x: hidden;
        margin: 0;
        padding: 20px;
        box-sizing: border-box;
        color: #f0f8ff; /* Color de texto general */
    }

    /* Estilos para el título 3D principal */
    .epic-title {
        font-size: clamp(40px, 10vw, 120px); /* Tamaño de fuente responsive */
        font-weight: 800;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap; /* Por defecto, no envuelve */
        perspective: 500px; /* Profundidad para el efecto 3D */
        color: ${config.rainbowMode ? 'transparent' : config.textColor}; /* Color base o transparente si es arcoíris */
        -webkit-text-stroke: ${config.outlineWidth}px ${config.outlineColor}; /* Contorno */
        letter-spacing: ${config.letterSpacing}rem; /* Espaciado entre letras */
        animation-name: ${config.floatAnimation ? 'float' : 'none'};
        animation-duration: ${config.floatAnimation ? `${config.animationSpeed}s` : ''};
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        animation-direction: alternate;
    }

    /* Estilos para cada carácter individual */
    .epic-title .char {
        display: inline-block;
        position: relative;
        transition: transform 0.3s ease; /* Transición para hover */
    }

    .epic-title .char:hover {
        transform: translateY(-5px) scale(1.1) !important; /* Efecto al pasar el ratón */
    }

    /* Estilo para el efecto de resplandor */
    .epic-title.glow {
        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
    }

    /* Animación de flotación */
    @keyframes float {
        from { transform: translateY(0); }
        to { transform: translateY(-20px); }
    }

    /* Estilos para el modo arcoíris */
    .epic-title.rainbow .char {
        color: hsl(calc(var(--char-index) * 57), 80%, 60%) !important; /* Color dinámico */
        animation: rainbow-pulse 3s infinite alternate;
    }

    @keyframes rainbow-pulse {
        to { filter: brightness(1.2) hue-rotate(360deg); }
    }

    /* Estilos para los caracteres individuales (transformaciones 3D) */
    ${charStyles}

    /* --- RESPONSIVE ADJUSTMENTS --- */
    /* Para Tablets y Escritorios Pequeños */
    @media (max-width: 1200px) {
        .epic-title { font-size: clamp(35px, 8vw, 100px); }
    }

    /* Para Tablets Pequeñas y Móviles Grandes */
    @media (max-width: 768px) {
        .epic-title {
            flex-wrap: wrap; /* Permite que el texto se envuelva */
            line-height: 1.1; /* Reduce el espacio entre líneas si se envuelve */
            font-size: clamp(30px, 10vw, 90px);
        }
        /* Adaptar los estilos 3D si se envuelve puede ser complejo, pero el enfoque principal es la legibilidad */
    }

    /* Para Móviles en vertical */
    @media (max-width: 480px) {
        .epic-title {
            font-size: clamp(25px, 12vw, 80px);
        }
    }
</style>
</head>
<body>
<h1 class="epic-title ${config.rainbowMode ? 'rainbow' : ''}">${charSpans.map(span => span.outerHTML).join('')}</h1>
</body>
</html>`;

    // Copia el HTML al portapapeles
    navigator.clipboard.writeText(htmlContent).then(() => {
        copyMsg.textContent = '¡HTML copiado!';
        copyMsg.classList.add('visible');
        setTimeout(() => copyMsg.classList.remove('visible'), 2000);
    }).catch(err => {
        copyMsg.textContent = 'Error al copiar.';
        console.error('Fallo al copiar: ', err);
        copyMsg.classList.add('visible');
        setTimeout(() => copyMsg.classList.remove('visible'), 2000);
    });
}

/**
 * Restaura los controles a su estado inicial.
 */
function handleReset() {
    config = { ...initialConfig }; // Copia los valores iniciales
    updateFormFromConfig(); // Actualiza los elementos del formulario
    applyStyles(); // Reaplica los estilos
}

/**
 * Genera una configuración aleatoria para todos los parámetros ajustables.
 * Mejora la consistencia y la "lindo" de las combinaciones.
 */
function handleRandomize() {
    const newConfig = { ...config }; // Empieza con la configuración actual

    // --- Selección aleatoria de estilos de sombreado y 3D ---
    const shadowStyles = [
        // Sombras suaves y profundas
        { shadowLength: getRandom(100, 200), shadowBlur: getRandom(10, 25), depthIntensity: getRandom(10, 20), perspectiveRotate: getRandom(-30, 30), startAngle: getRandom(70, 110), endAngle: getRandom(70, 110), outlineWidth: getRandom(1, 3), letterSpacing: getRandom(-0.2, 0.1), glowEffect: false, floatAnimation: getRandom(0, 1) > 0.5, animationSpeed: getRandom(4, 8) },
        // Sombras vibrantes y neón
        { shadowLength: getRandom(5, 30), shadowBlur: getRandom(15, 30), depthIntensity: getRandom(5, 10), perspectiveRotate: getRandom(-10, 10), startAngle: getRandom(0, 360), endAngle: getRandom(0, 360), outlineWidth: getRandom(2, 4), letterSpacing: getRandom(0.1, 0.4), glowEffect: true, floatAnimation: getRandom(0, 1) > 0.3, animationSpeed: getRandom(3, 6) },
        // Sombras audaces y con volumen
        { shadowLength: getRandom(20, 80), shadowBlur: getRandom(2, 8), depthIntensity: getRandom(8, 15), perspectiveRotate: getRandom(-20, 20), startAngle: getRandom(20, 160), endAngle: getRandom(20, 160), outlineWidth: getRandom(4, 7), letterSpacing: getRandom(-0.3, 0.2), glowEffect: false, floatAnimation: getRandom(0, 1) > 0.7, animationSpeed: getRandom(5, 9) },
        // Efectos más sutiles y elegantes
        { shadowLength: getRandom(10, 50), shadowBlur: getRandom(5, 15), depthIntensity: getRandom(4, 10), perspectiveRotate: getRandom(-5, 5), startAngle: 90, endAngle: 90, outlineWidth: getRandom(1, 2), letterSpacing: getRandom(-0.1, 0.1), glowEffect: getRandom(0, 1) > 0.7, floatAnimation: false, animationSpeed: getRandom(6, 10) },
        // Estilos aleatorios puros
        { shadowLength: getRandom(0, 150), shadowBlur: getRandom(0, 30), depthIntensity: getRandom(1, 15), perspectiveRotate: getRandom(-45, 45), startAngle: getRandom(0, 360), endAngle: getRandom(0, 360), outlineWidth: getRandom(1, 8), letterSpacing: getRandom(-0.5, 0.8), glowEffect: getRandom(0, 1) > 0.5, floatAnimation: getRandom(0, 1) > 0.4, animationSpeed: getRandom(3, 12) }
    ];

    const selectedStyle = shadowStyles[Math.floor(Math.random() * shadowStyles.length)];

    // Fusionar el estilo seleccionado con la configuración actual
    Object.assign(newConfig, selectedStyle);

    // --- Selección de colores ---
    // Priorizar el arcoíris si se selecciona aleatoriamente
    newConfig.rainbowMode = Math.random() > 0.5;
    if (newConfig.rainbowMode) {
        newConfig.textColor = '#FFFFFF'; // Color neutro cuando está en modo arcoíris
        // Para el arcoíris, a menudo es bueno tener un outline oscuro o plateado
        newConfig.outlineColor = ['#000000', '#333333', '#808080'][Math.floor(Math.random() * 3)];
        newConfig.shadowColor = '#000000'; // Sombra oscura para que resalte el arcoíris
    } else {
        // Seleccionar colores consistentes entre sí si no es arcoíris
        const colorPalette = [
            ['#F8DB28', '#901F06', '#5E3143'], // Amarillo/Oro con sombras rojizas/marrones
            ['#00ffff', '#000000', '#00ffff'], // Neón azul/cian
            ['#e0cda7', '#3d2b1f', '#000000'], // Beige/Oro con sombras marrón oscuro
            ['#ffffff', '#000000', '#404040'], // Blanco con sombras grises/negras
            ['#ff69b4', '#8a2be2', '#ffc0cb'], // Rosa/Violeta
            ['#c0c0c0', '#808080', '#404040'], // Metálico/Plateado
            ['#ffff00', '#ff00ff', '#ff4500'], // Retro amarillo/magenta/naranja
            ['#ffffff', '#483D8B', '#8A2BE2'], // Galaxia blanco/azul oscuro/violeta
        ];
        const selectedPalette = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        newConfig.textColor = selectedPalette[0];
        newConfig.outlineColor = selectedPalette[1];
        newConfig.shadowColor = selectedPalette[2];
    }

    // --- Selección de texto ---
    const texts = ['¡Genial!', 'Wow!', 'Explosivo!', 'Estilo 3D', 'Diseño Web', '¡Avanzado!', 'Dulce!', 'Creativo'];
    newConfig.text = texts[Math.floor(Math.random() * texts.length)];

    config = newConfig; // Actualiza la configuración global
    updateFormFromConfig(); // Refleja los nuevos valores en el formulario
    applyStyles(); // Aplica los nuevos estilos
}

/**
 * Genera un número aleatorio entre min (inclusive) y max (inclusive).
 * @param {number} min - Valor mínimo.
 * @param {number} max - Valor máximo.
 * @returns {number} Un número aleatorio.
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * Crea las partículas de fondo de manera dinámica.
 * @param {number} count - Número de partículas a crear.
 */
function createParticles(count = 80) { // Por defecto 80 partículas
    if (!particlesContainer) return; // Si el contenedor no existe, no hagas nada

    // Limpiar partículas existentes antes de crear nuevas
    particlesContainer.innerHTML = '';

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Posición aleatoria
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        particle.style.left = `${xPos}%`;
        particle.style.top = `${yPos}%`;

        // Tamaño aleatorio
        const size = Math.random() * 15 + 5; // Entre 5px y 20px
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Opacidad aleatoria
        const opacity = Math.random() * 0.2 + 0.1; // Entre 0.1 y 0.3
        particle.style.opacity = opacity;

        // Duración de la animación aleatoria para que no todas se muevan al mismo tiempo
        const animationDuration = Math.random() * 10 + 10; // Entre 10s y 20s
        particle.style.animationDuration = `${animationDuration}s`;

        // Desplazamiento X aleatorio al final de la animación para un movimiento más variado
        const translateX = (Math.random() * 200 - 100); // Entre -100px y +100px
        particle.style.setProperty('--particle-translate-x', `${translateX}px`);

        particlesContainer.appendChild(particle);
    }
}

// ========================================
//  MANEJADORES DE EVENTOS
// ========================================

// Actualiza estilos cada vez que cambia un control del formulario
form.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        readConfigFromForm();
        updateTextDisplay(); // Asegura que los caracteres se actualicen si el texto cambia
    }, 10); // Un pequeño delay para que la lectura del config sea consistente
});

// Manejar clic en botón de copiar
copyBtn.addEventListener('click', generateAndCopyHtml);

// Manejar clic en botón de reset
resetBtn.addEventListener('click', handleReset);

// Manejar clic en botón de aleatorio
if (randomBtn) { // Asegurarse de que el botón existe antes de añadir el listener
    randomBtn.addEventListener('click', handleRandomize);
}

// Manejar clics en botones de preset
presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const presetName = btn.dataset.preset;
        if (presets[presetName]) {
            // Fusiona la configuración del preset con la configuración actual
            config = { ...config, ...presets[presetName] };
            updateFormFromConfig(); // Actualiza el formulario
            applyStyles(); // Reaplica los estilos
        }
    });
});

// Manejar clics en selectores de fondo
bgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remueve la clase 'active' de todos los botones de fondo
        bgButtons.forEach(b => b.classList.remove('active'));
        // Añade la clase 'active' al botón clicado
        btn.classList.add('active');
        // Aplica el gradiente de fondo al contenedor de demo
        demoContainer.style.background = btn.dataset.bg;
        // Nota: Si quieres que las partículas o el texto cambien de color basado en el fondo,
        // necesitarás lógica adicional aquí.
    });
});

// ========================================
//  INICIALIZACIÓN
// ========================================

// Ejecuta las funciones de inicialización una vez que el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    createParticles(); // Crea las partículas de fondo
    updateFormFromConfig(); // Carga los valores iniciales en el formulario
    updateTextDisplay(); // Muestra el texto inicial con sus estilos
});