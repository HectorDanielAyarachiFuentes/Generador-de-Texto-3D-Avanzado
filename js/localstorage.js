// ========================================
//  LOCALSTORAGE MANAGEMENT
// ========================================

const LOCAL_STORAGE_KEY = '3dTextGeneratorState';

/**
 * Guarda el estado de la configuración en el LocalStorage.
 * @param {object} state - El objeto de configuración para guardar.
 */
export function saveStateToLocalStorage(state) {
    try {
        const stateString = JSON.stringify(state);
        localStorage.setItem(LOCAL_STORAGE_KEY, stateString);
    } catch (error) {
        console.error("Error al guardar el estado en LocalStorage:", error);
    }
}

/**
 * Carga el estado de la configuración desde el LocalStorage.
 * @returns {object|null} El objeto de configuración guardado o null si no hay nada.
 */
export function loadStateFromLocalStorage() {
    try {
        const stateString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stateString === null) {
            return null;
        }
        return JSON.parse(stateString);
    } catch (error) {
        console.error("Error al cargar el estado desde LocalStorage:", error);
        return null;
    }
}
