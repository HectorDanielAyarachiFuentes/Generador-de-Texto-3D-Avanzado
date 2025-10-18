// ========================================
//  MAIN ENTRY POINT - MODULAR SCRIPT
// ========================================

import { config } from './js/config.js';
import { form } from './js/dom.js';
import { updateTextDisplay, applyStyles } from './js/effects.js';
import { updateFormFromConfig, generateAndCopyHtml, handleReset, handleRandomize, setupPresetButtons, setupBackgroundButtons } from './js/handlers.js';
import { createParticles } from './js/particles.js';

// Variables para la lógica del script
let debounceTimer; // Para controlar la frecuencia de actualización de estilos

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

// ========================================
//  MANEJADORES DE EVENTOS
// ========================================

// Actualiza estilos cada vez que cambia un control del formulario (con debounce)
form.addEventListener('input', () => {
    // Actualiza el valor numérico del slider en tiempo real
    if (e.target.type === 'range') {
        const valueDisplay = document.getElementById(`${e.target.id}-value`);
        if (valueDisplay) {
            let value = e.target.value;
            if (e.target.step.includes('.')) { // Si es un flotante
                value = parseFloat(value).toFixed(2);
            }
            valueDisplay.textContent = value;
        }
    }

    // Usa debounce para no sobrecargar el renderizado de estilos
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        readConfigFromForm();
        updateTextDisplay(); // Recrea los spans si el texto cambia y aplica estilos
    }, 10); // Un pequeño delay para que la lectura del config sea consistente
});

// Manejar clic en botón de copiar
document.getElementById('copy-css-button').addEventListener('click', generateAndCopyHtml);

// Manejar clic en botón de reset
document.getElementById('reset-button').addEventListener('click', handleReset);

// Manejar clic en botón de aleatorio
const randomBtn = document.getElementById('random-button');
if (randomBtn) { // Asegurarse de que el botón existe antes de añadir el listener
    randomBtn.addEventListener('click', handleRandomize);
}

// Manejar la lógica del acordeón en el panel de controles
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
        // Cerrar todos los items
        accordionItems.forEach(otherItem => {
            if (otherItem !== item) otherItem.classList.remove('active');
        });
        // Abrir/cerrar el item actual
        item.classList.toggle('active');
    });
});

// ========================================
//  INICIALIZACIÓN
// ========================================

// Ejecuta las funciones de inicialización una vez que el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    createParticles(); // Crea las partículas de fondo
    setupPresetButtons(); // Configura botones de preset
    setupBackgroundButtons(); // Configura botones de fondo
    updateFormFromConfig(); // Carga los valores iniciales en el formulario
    updateTextDisplay(); // Muestra el texto inicial con sus estilos
});
