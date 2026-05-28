/**
 * ELEMENTAL CLASH - Main Game Configuration
 * Arcade 1v1 Fighting Game
 */

import { BootScene } from './scenes/BootScene.js';
import { MainMenuScene } from './scenes/MainMenuScene.js';
import { SettingsScene } from './scenes/SettingsScene.js';
import { CharacterSelectScene } from './scenes/CharacterSelectScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { ResultScene } from './scenes/ResultScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    scene: [
        BootScene,
        MainMenuScene,
        SettingsScene,
        CharacterSelectScene,
        BattleScene,
        ResultScene
    ],
    pixelArt: true,
    roundPixels: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        fullscreenTarget: 'game-container'
    }
};

const game = new Phaser.Game(config);

// Handle window resize
window.addEventListener('resize', () => {
    game.scale.refresh();
});

// Global F11 fullscreen toggle
window.addEventListener('keydown', (event) => {
    if (event.key === 'F11') {
        event.preventDefault();
        
        if (game.scale.isFullscreen) {
            game.scale.stopFullscreen();
        } else {
            game.scale.startFullscreen();
        }
    }
});

// Listen for fullscreen changes
game.scale.on('enterfullscreen', () => {
    console.log('[Fullscreen] Entered fullscreen mode');
});

game.scale.on('leavefullscreen', () => {
    console.log('[Fullscreen] Exited fullscreen mode');
});

console.log('ELEMENTAL CLASH - Game Initialized');
