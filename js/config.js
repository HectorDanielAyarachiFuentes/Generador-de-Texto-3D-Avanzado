// ========================================
//  ESTADO Y CONFIGURACIÓN INICIAL
// ========================================
export const initialConfig = {
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
    animationSpeed: 6,
    backgroundColor: '#000000'
};

// Presets para los botones rápidos
export const presets = {
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

// Estado actual de configuración
export let config = { ...initialConfig };
