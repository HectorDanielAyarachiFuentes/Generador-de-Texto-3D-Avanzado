// ========================================
//  FUNCIONES UTILITARIAS
// ========================================

/**
 * Convierte un color hexadecimal a un array RGB [r, g, b].
 * @param {string} hex - El color hexadecimal (ej. '#F8DB28').
 * @returns {Array<number>} - El array RGB.
 */
export function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

/**
 * Genera un número aleatorio entre min (inclusive) y max (inclusive).
 * @param {number} min - Valor mínimo.
 * @param {number} max - Valor máximo.
 * @returns {number} Un número aleatorio.
 */
export function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Actualiza los valores numéricos mostrados al lado de los sliders.
 */
export function updateLabelValues(config) {
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
