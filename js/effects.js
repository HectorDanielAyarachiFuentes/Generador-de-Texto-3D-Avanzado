import { config } from './config.js';
import { shadowHost, textColorInput } from './dom.js';
import { hexToRgb, updateLabelValues } from './utils.js';

// Variables para la lógica del script
let charSpans = []; // Almacena los spans de cada carácter para aplicar transformaciones 3D

// ========================================
//  FUNCIONES DE CONFIGURACIÓN Y ACTUALIZACIÓN
// ========================================

/**
 * Crea los elementos <span> para cada carácter del texto.
 * Esto es necesario para poder aplicar transformaciones 3D individuales.
 */
export function updateTextDisplay() {
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
        // Añadir clases necesarias para estilos
        shadowHost.classList.add('epic-title');
        if (config.rainbowMode) {
            shadowHost.classList.add('rainbow');
        } else {
            shadowHost.classList.remove('rainbow');
        }
    }
    applyStyles(); // Aplica todos los estilos después de actualizar los caracteres
}

/**
 * Aplica todos los estilos configurados al elemento #vanish-shadow
 * y sus caracteres, basándose en el objeto 'config'.
 */
export function applyStyles() {
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
    updateLabelValues(config);
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

        // OPTIMIZACIÓN: Usar un número de pasos fijo y más bajo, y saltar a través de la longitud.
        // Esto reduce drásticamente el número de capas de sombra generadas para un mejor rendimiento.
        const steps = Math.max(10, Math.min(20, Math.ceil(length / 5))); // Entre 10 y 20 pasos.
        const stepIncrement = length / steps; // Distancia que salta cada paso.

        for (let i = 1; i <= steps; i++) {
            const currentLength = i * stepIncrement;
            const progress = currentLength / length; // Progreso de la sombra (0 a 1)
            const x = (currentLength * xDir).toFixed(2);
            const y = (currentLength * yDir).toFixed(2);
            // La opacidad disminuye a medida que la sombra se aleja
            const opacity = (0.5 * (1 - progress * 0.8)).toFixed(3);
            // El desenfoque aumenta con la distancia
            const blur = (progress * blurBase).toFixed(2);
            shadowParts.push(`${x}px ${y}px ${blur}px rgba(${r},${g},${b},${opacity})`);
        }
    }
    // Devuelve las partes de la sombra separadas por comas, o 'none' si no hay sombras
    return shadowParts.length > 0 ? shadowParts.join(', ') : 'none';
}

export { charSpans };
