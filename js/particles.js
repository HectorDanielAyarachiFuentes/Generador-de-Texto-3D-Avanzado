import { particlesContainer } from './dom.js';

/**
 * Crea las partículas de fondo de manera dinámica.
 * @param {number} count - Número de partículas a crear.
 */
export function createParticles(count = 80) { // Por defecto 80 partículas
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
