import { config, presets, initialConfig } from './config.js';
import { form, presetButtons, bgButtons, copyMsg, demoContainer, textColorInput } from './dom.js';
import { getRandom } from './utils.js';
import { applyStyles, charSpans } from './effects.js';
import { pushState } from './history.js';

// ========================================
//  MANEJADORES DE EVENTOS
// ========================================

/**
 * Actualiza el formulario HTML para que refleje el estado actual del objeto 'config'.
 * Útil para aplicar presets o restaurar la configuración.
 */
export function updateFormFromConfig() {
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
                    let value = config[key];
                    if (typeof value === 'number' && !Number.isInteger(value)) {
                        value = value.toFixed(2);
                    }
                    valueDisplay.textContent = value;
                }
            }
        }
    }
    if (textColorInput) textColorInput.disabled = config.rainbowMode;
}

/**
 * Genera el HTML completo para copiar, incluyendo estilos para el texto 3D.
 */
export function generateAndCopyHtml() {
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
export function handleReset() {
    Object.assign(config, { ...initialConfig }); // Copia los valores iniciales
    updateFormFromConfig(); // Actualiza los elementos del formulario
    pushState(config); // Guarda el estado de reseteo en el historial
    applyStyles(); // Reaplica los estilos
}

/**
 * Genera una configuración aleatoria para todos los parámetros ajustables.
 * Mejora la consistencia y la "lindo" de las combinaciones.
 */
export function handleRandomize() {
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

    Object.assign(config, newConfig); // Actualiza la configuración global
    updateFormFromConfig(); // Refleja los nuevos valores en el formulario
    pushState(config); // Guarda el estado aleatorio en el historial
    applyStyles(); // Aplica los nuevos estilos
}

// Manejar clics en botones de preset
export function setupPresetButtons() {
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const presetName = btn.dataset.preset;
            if (presets[presetName]) {
                // Fusiona la configuración del preset con la configuración actual
                Object.assign(config, presets[presetName]);
                pushState(config); // Guarda el estado del preset en el historial
                updateFormFromConfig(); // Actualiza el formulario
                applyStyles(); // Reaplica los estilos
            }
        });
    });
}

// Manejar clics en selectores de fondo
export function setupBackgroundButtons() {
    bgButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remueve la clase 'active' de todos los botones de fondo
            bgButtons.forEach(b => b.classList.remove('active'));
            // Añade la clase 'active' al botón clicado
            btn.classList.add('active');
            // Aplica el gradiente de fondo al contenedor de demo
            demoContainer.style.background = btn.dataset.bg;
        });
    });
}
