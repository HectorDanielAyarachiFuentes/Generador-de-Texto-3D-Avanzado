import { config } from './config.js';
import { updateFormFromConfig } from './handlers.js';
import { applyStyles } from './effects.js';
import { undoBtn, redoBtn } from './dom.js';

const MAX_HISTORY_SIZE = 50;
let history = [];
let historyIndex = -1;

/**
 * Actualiza el estado de los botones de deshacer/rehacer.
 */
function updateButtonStates() {
    if (!undoBtn || !redoBtn) return;
    undoBtn.disabled = historyIndex <= 0;
    redoBtn.disabled = historyIndex >= history.length - 1;
}

/**
 * Guarda el estado actual de la configuración en el historial.
 * @param {object} state - El estado de la configuración a guardar.
 */
export function pushState(state) {
    // Si estamos en medio del historial, eliminamos los estados futuros.
    if (historyIndex < history.length - 1) {
        history = history.slice(0, historyIndex + 1);
    }

    // Añadir el nuevo estado
    history.push(JSON.parse(JSON.stringify(state))); // Guardar una copia profunda

    // Limitar el tamaño del historial
    if (history.length > MAX_HISTORY_SIZE) {
        history.shift();
    }

    historyIndex = history.length - 1;
    updateButtonStates();
}

/**
 * Deshace la última acción.
 */
export function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        applyStateFromHistory();
    }
}

/**
 * Rehace la última acción deshecha.
 */
export function redo() {
    if (historyIndex < history.length - 1) {
        historyIndex++;
        applyStateFromHistory();
    }
}

/**
 * Aplica el estado actual del historial a la aplicación.
 */
function applyStateFromHistory() {
    const state = history[historyIndex];
    if (state) {
        Object.assign(config, JSON.parse(JSON.stringify(state))); // Cargar una copia
        updateFormFromConfig();
        applyStyles();
        updateButtonStates();
    }
}

/**
 * Inicializa el historial con un estado inicial.
 */
export function initHistory(initialState) {
    pushState(initialState);
}