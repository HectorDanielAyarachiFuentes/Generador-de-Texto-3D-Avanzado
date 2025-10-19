// ========================================
//  MAIN ENTRY POINT - MODULAR SCRIPT
// ========================================

import { config, presets, initialConfig } from './js/config.js'; 
import { form, undoBtn, redoBtn, demoContainer, exportPngBtn } from './js/dom.js';
import { pushState, undo, redo, initHistory } from './js/history.js';
import { updateTextDisplay, applyStyles } from './js/effects.js';
import { updateFormFromConfig, generateAndCopyHtml, handleReset, handleRandomize, setupPresetButtons, setupBackgroundButtons, handleExportToPng } from './js/handlers.js';
import { createParticles } from './js/particles.js';
import { saveStateToLocalStorage, loadStateFromLocalStorage } from './js/localstorage.js';

// Variables para la lógica del script
let debounceTimer; // Para controlar la frecuencia de actualización de estilos

// ========================================
//  MOVEABLE.JS LOGIC
// ========================================
let currentMoveableInstances = [];
let editMode = 'word'; // 'word' or 'letter'

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
 * Aplica un estilo aleatorio al H1 de la cabecera para hacerlo más dinámico.
 */
function applyRandomHeaderStyle() {
    const headerH1 = document.querySelector('.app-header h1');
    if (!headerH1) return;

    // Elige un preset aleatorio de la lista de presets
    const presetKeys = Object.keys(presets);
    const randomPresetKey = presetKeys[Math.floor(Math.random() * presetKeys.length)];
    const randomPreset = presets[randomPresetKey];

    // Clona la configuración del preset para no modificar la original
    const headerConfig = { ...config, ...randomPreset };
    headerConfig.text = "Generador 3D"; // Fija el texto

    // Crea los spans para el título
    headerH1.innerHTML = '';
    const charSpans = [];
    headerConfig.text.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.className = 'char';
        span.innerHTML = char === ' ' ? '&nbsp;' : char;
        span.style.setProperty('--char-index', index);
        headerH1.appendChild(span);
        charSpans.push(span);
    });

    // Aplica los estilos directamente a los spans del header
    headerH1.style.color = headerConfig.rainbowMode ? '' : headerConfig.textColor;
    headerH1.style.webkitTextStroke = `${headerConfig.outlineWidth}px ${headerConfig.outlineColor}`;
    headerH1.style.letterSpacing = `${headerConfig.letterSpacing}rem`;
    headerH1.classList.toggle('rainbow-mode-active', headerConfig.rainbowMode);
    headerH1.classList.toggle('glow', headerConfig.glowEffect);
}

// ========================================
//  MANEJADORES DE EVENTOS
// ========================================

// Actualiza estilos cada vez que cambia un control del formulario (con debounce)
form.addEventListener('input', (e) => {
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
        setupMoveable(); // Re-initialize moveable if text/chars change
        saveStateToLocalStorage(config); // Guarda el estado en tiempo real
    }, 10); // Un pequeño delay para que la lectura del config sea consistente
});

// Guardar estado en el historial cuando un cambio es "confirmado" por el usuario
form.addEventListener('change', () => {
    readConfigFromForm();
    pushState(config);
    saveStateToLocalStorage(config);
});


// Manejar clic en botón de copiar
document.getElementById('copy-css-button').addEventListener('click', generateAndCopyHtml);

// Manejar clic en botón de exportar a PNG
exportPngBtn.addEventListener('click', handleExportToPng);

// Manejar clic en botón de reset
document.getElementById('reset-button').addEventListener('click', handleReset);

// Manejar clic en botón de aleatorio
undoBtn.addEventListener('click', undo);
redoBtn.addEventListener('click', redo);

// Atajos de teclado para deshacer/rehacer
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        undo();
    }
    if (e.ctrlKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
    }
});

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

// Manejar cambio de modo de edición (Moveable.js)
document.getElementById('edit-mode-word').addEventListener('click', () => switchEditMode('word'));
document.getElementById('edit-mode-letter').addEventListener('click', () => switchEditMode('letter'));

function switchEditMode(newMode) {
    if (editMode === newMode) return;
    editMode = newMode;

    document.getElementById('edit-mode-word').classList.toggle('active', newMode === 'word');
    document.getElementById('edit-mode-letter').classList.toggle('active', newMode === 'letter');
    
    const demoContainer = document.getElementById('demo-container');
    demoContainer.classList.toggle('letter-edit-mode', newMode === 'letter');

    setupMoveable();
}
// ========================================
//  INICIALIZACIÓN
// ========================================

// Ejecuta las funciones de inicialización una vez que el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    const savedState = loadStateFromLocalStorage();
    if (savedState) {
        Object.assign(config, savedState);
        Object.assign(initialConfig, savedState);
    }

    demoContainer.style.background = config.backgroundColor;

    createParticles(); // Crea las partículas de fondo
    initHistory(initialConfig); // Inicializa el historial con el estado inicial
    applyRandomHeaderStyle(); // Aplica un estilo aleatorio al título de la app
    setupPresetButtons(); // Configura botones de preset
    setupBackgroundButtons(); // Configura botones de fondo
    updateFormFromConfig(); // Carga los valores iniciales en el formulario
    updateTextDisplay(); // Muestra el texto inicial con sus estilos
    setupMoveable(); // Configura Moveable.js por primera vez
});

/**
 * Configura las instancias de Moveable.js según el modo de edición actual.
 * Destruye las instancias antiguas y crea las nuevas.
 */
function setupMoveable() {
    // 1. Destruir todas las instancias de Moveable existentes
    currentMoveableInstances.forEach(instance => instance.destroy());
    currentMoveableInstances = [];

    const container = document.getElementById('demo-container');
    const commonOptions = {
        draggable: true,
        scalable: true,
        rotatable: true,
        throttleDrag: 1,
        throttleScale: 0.01,
        throttleRotate: 0.2,
        keepRatio: true,
    };

    if (editMode === 'word') {
        const target = document.getElementById('vanish-shadow');
        if (!target) return;

        target.style.position = 'absolute'; // Necesario para Moveable

        const moveable = new Moveable(container, {
            ...commonOptions,
            target: target,
        });

        moveable.on("render", e => {
            e.target.style.transform = e.transform;
        });

        currentMoveableInstances.push(moveable);

    } else if (editMode === 'letter') {
        const letters = document.querySelectorAll('#vanish-shadow .char');
        letters.forEach(letter => {
            letter.style.position = 'relative'; // Necesario para Moveable
            letter.style.display = 'inline-block'; // Asegura que se pueda transformar

            const moveable = new Moveable(container, {
                ...commonOptions,
                target: letter,
                origin: false, // Mejora la experiencia de rotación para letras
            });

            moveable.on("render", e => {
                e.target.style.transform = e.transform;
            });

            currentMoveableInstances.push(moveable);
        });
    }
}
