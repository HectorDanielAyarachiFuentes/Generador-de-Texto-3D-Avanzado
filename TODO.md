# Refactor JS into Modules - TODO List

## 1. Create Modules Folder Structure
- [x] Create `js/` folder to hold all modules

## 2. Create config.js Module
- [x] Export initialConfig, presets, and config object
- [x] Include functions to update config from form and form from config

## 3. Create dom.js Module
- [x] Export all DOM element selectors (form, shadowHost, etc.)

## 4. Create utils.js Module
- [x] Export utility functions: hexToRgb, getRandom, updateLabelValues

## 5. Create effects.js Module
- [x] Export 3D effect functions: apply3DEffects, applyShadows, generateFadingShadow
- [x] Export style application functions: applyStyles, updateTextDisplay
- [x] Manage charSpans array internally

## 6. Create handlers.js Module
- [x] Export event handlers: handleReset, handleRandomize, generateAndCopyHtml
- [x] Include preset and background button handlers

## 7. Create particles.js Module
- [x] Export createParticles function

## 8. Refactor script.js (Main Entry Point)
- [x] Import all modules
- [x] Coordinate initialization and event binding
- [x] Manage global state like debounceTimer

## 9. Update index.html
- [x] Change script tag to load script.js as type="module"

## 10. Test Refactored Code
- [x] Verify all functionality works after refactor
- [x] Check console for any errors
