/**
 * ELEMENTAL CLASH - Boot Scene
 * Load all game assets for 4 elemental fighters
 */

import { manifest } from '../assets/Elemental/manifest.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Loading bar
        this.createLoadingBar();

        // Load map assets (keep current map)
        this.loadMapAssets();

        // Load UI assets
        this.loadUIAssets();

        // Load sounds
        this.loadSounds();

        // Load all 4 elemental characters from manifest
        for (const [charKey, charAnims] of Object.entries(manifest)) {
            console.log(`[BootScene] Preloading ${charKey} frames from manifest...`);
            for (const [animKey, framePaths] of Object.entries(charAnims)) {
                framePaths.forEach((path, index) => {
                    const frameKey = `${charKey}_${animKey}_${index + 1}`;
                    this.load.image(frameKey, path);
                });
            }
        }

        // Load character portraits
        this.loadPortraits();
    }

    createLoadingBar() {
        const width = 600;
        const height = 30;
        const x = (1280 - width) / 2;
        const y = 360;

        // Background
        const bg = this.add.rectangle(640, y, width, height, 0x222222);
        bg.setStrokeStyle(2, 0xffffff);

        // Progress bar
        const bar = this.add.rectangle(x, y, 0, height - 4, 0xffaa00);
        bar.setOrigin(0, 0.5);

        // Loading text
        const loadingText = this.add.text(640, y - 50, 'LOADING...', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Update progress
        this.load.on('progress', (value) => {
            bar.width = (width - 4) * value;
        });

        this.load.on('complete', () => {
            loadingText.setText('COMPLETE!');
            this.time.delayedCall(500, () => {
                this.scene.start('MainMenuScene');
            });
        });
    }

    loadMapAssets() {
        // Battleground2 - Official battle arena (Bright version)
        const mapPath = 'assets/map/map/Battleground2/Bright';
        
        this.load.image('bg_battleground2', `${mapPath}/bg.png`);
        this.load.image('mountains_battleground2', `${mapPath}/mountaims.png`);
        this.load.image('wall_battleground2', `${mapPath}/wall@windows.png`);
        this.load.image('columns_battleground2', `${mapPath}/columns&falgs.png`);
        this.load.image('dragon_battleground2', `${mapPath}/dragon.png`);
        this.load.image('candeliar_battleground2', `${mapPath}/candeliar.png`);
        this.load.image('floor_battleground2', `${mapPath}/floor.png`);
        
        console.log('[BootScene] Loading Battleground2 map assets...');
    }

    loadUIAssets() {
        // Particles
        this.load.image('particle', 'assets/particles/particle.png');
        this.load.image('ember', 'assets/particles/ember.png');
        this.load.image('smoke', 'assets/particles/smoke.png');
        this.load.image('slash', 'assets/particles/slash.png');
    }

    loadSounds() {
        this.load.audio('bgm', 'assets/sounds/bgm.wav');
        this.load.audio('attack', 'assets/sounds/attack.wav');
        this.load.audio('hit', 'assets/sounds/hit.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('boss', 'assets/sounds/boss.wav');

        // Character-specific elemental sounds
        const characters = ['gale', 'homura', 'sylvan', 'terra'];
        const actions = ['attack', 'jump', 'hurt', 'dead'];

        characters.forEach(char => {
            actions.forEach(action => {
                const key = `${char}_${action}`;
                this.load.audio(key, `assets/sounds/${key}.wav`);
            });
        });
    }

    loadPortraits() {
        // Character portraits for select screen
        this.load.image('portrait_gale', 'assets/Elemental/gale/wind_hashashin.png');
        this.load.image('portrait_homura', 'assets/Elemental/homura/fire_knight.png');
        this.load.image('portrait_sylvan', 'assets/Elemental/sylvan/leaf_ranger.png');
        this.load.image('portrait_terra', 'assets/Elemental/terra/ground_monk.png');
    }

    create() {
        console.log('[BootScene] All assets loaded successfully!');
        
        // Initialize settings from localStorage
        const bgmEnabled = localStorage.getItem('bgmEnabled');
        const sfxEnabled = localStorage.getItem('sfxEnabled');

        this.registry.set('bgmEnabled', bgmEnabled !== 'false');
        this.registry.set('sfxEnabled', sfxEnabled !== 'false');
    }
}
