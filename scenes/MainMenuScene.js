/**
 * ELEMENTAL CLASH - Main Menu Scene
 * Arcade-style main menu with retro fighting game atmosphere
 */

import { FullscreenManager } from '../scripts/FullscreenManager.js';

export class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Dark mystical background
        this.cameras.main.setBackgroundColor('#0a0a1a');
        
        // Animated background particles
        this.createBackgroundEffects();
        
        // Title
        this.createTitle();
        
        // Menu options
        this.createMenu();
        
        // Fade in
        this.cameras.main.fadeIn(800, 0, 0, 0);
        
        // BGM
        if (!this.sound.get('bgm')) {
            this.sound.play('bgm', {
                loop: true,
                volume: 0.3
            });
        }
    }

    createBackgroundEffects() {
        // Elemental particles floating
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 1280 },
            y: { min: -50, max: 770 },
            speedY: { min: -30, max: -60 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 4000,
            frequency: 200,
            tint: [0x00ffff, 0xff6600, 0x00ff00, 0xffaa00]
        });
    }

    createTitle() {
        // Main title
        const title = this.add.text(640, 180, 'ELEMENTAL', {
            fontSize: '96px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const subtitle = this.add.text(640, 270, 'CLASH', {
            fontSize: '96px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Glow effect
        this.tweens.add({
            targets: [title, subtitle],
            alpha: { from: 0.8, to: 1 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Tagline
        this.add.text(640, 340, 'Arcade Fighting Game', {
            fontSize: '24px',
            fill: '#888888',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    createMenu() {
        const menuOptions = [
            { text: 'START GAME', action: () => this.startGame() },
            { text: 'SETTINGS', action: () => this.openSettings() },
            { text: 'FULLSCREEN', action: () => this.toggleFullscreen() },
            { text: 'EXIT GAME', action: () => this.exitGame() }
        ];

        const startY = 430;
        const spacing = 70;

        menuOptions.forEach((option, index) => {
            const y = startY + (index * spacing);
            
            const btn = this.add.text(640, y, option.text, {
                fontSize: '40px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            // Hover effects
            btn.on('pointerover', () => {
                btn.setStyle({ fill: '#ffaa00' });
                btn.setScale(1.1);
                this.playSound('hit', { volume: 0.2, rate: 2 });
            });

            btn.on('pointerout', () => {
                btn.setStyle({ fill: '#ffffff' });
                btn.setScale(1);
            });

            btn.on('pointerdown', () => {
                this.playSound('attack', { volume: 0.3 });
                this.cameras.main.flash(200, 255, 255, 255, false);
                this.time.delayedCall(200, () => {
                    option.action();
                });
            });
        });

        // F11 hint
        this.add.text(640, 680, 'Press F11 for Fullscreen', {
            fontSize: '18px',
            fill: '#666666',
            fontStyle: 'italic'
        }).setOrigin(0.5);
    }

    startGame() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CharacterSelectScene');
        });
    }

    openSettings() {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('SettingsScene');
        });
    }

    toggleFullscreen() {
        FullscreenManager.toggle(this);
    }

    showFullscreenNotification(message) {
        FullscreenManager.showNotification(this, message);
    }

    exitGame() {
        // Show confirmation
        const confirmBg = this.add.rectangle(640, 360, 600, 300, 0x000000, 0.9);
        const confirmText = this.add.text(640, 320, 'Exit Game?', {
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        const yesBtn = this.add.text(540, 400, 'YES', {
            fontSize: '32px',
            fill: '#ff0000',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => yesBtn.setScale(1.2))
        .on('pointerout', () => yesBtn.setScale(1))
        .on('pointerdown', () => {
            window.close();
        });

        const noBtn = this.add.text(740, 400, 'NO', {
            fontSize: '32px',
            fill: '#00ff00',
            fontStyle: 'bold'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => noBtn.setScale(1.2))
        .on('pointerout', () => noBtn.setScale(1))
        .on('pointerdown', () => {
            confirmBg.destroy();
            confirmText.destroy();
            yesBtn.destroy();
            noBtn.destroy();
        });
    }

    playSound(key, config = {}) {
        if (this.registry.get('sfxEnabled') !== false) {
            try {
                this.sound.play(key, config);
            } catch (e) {
                console.warn('Sound error:', key);
            }
        }
    }
}
