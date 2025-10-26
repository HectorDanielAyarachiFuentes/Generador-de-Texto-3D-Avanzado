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
    for (const key in config) {
        // Convierte camelCase (e.g., letterSpacing) a kebab-case (e.g., letter-spacing)
        const id = key.replace(/([A-Z])/g, "-$1").toLowerCase();
        const valueDisplay = document.getElementById(`${id}-value`);
        
        if (valueDisplay) {
            let value = config[key];
            // Formatea los números flotantes a 2 decimales
            if (typeof value === 'number' && !Number.isInteger(value)) {
                value = value.toFixed(2);
            }
            valueDisplay.textContent = value;
        }
    }
}
