/**
 * ELEMENTAL CLASH - Result Scene
 * Arcade-style match result screen
 */

import { FullscreenManager } from '../scripts/FullscreenManager.js';

export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.winner = data.winner || 'player1';
        this.player1Char = data.player1 || 'gale';
        this.player2Char = data.player2 || 'homura';
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        const isP1Winner = this.winner === 'player1';

        // Result text
        const resultText = this.add.text(640, 200, isP1Winner ? 'VICTORY!' : 'DEFEAT!', {
            fontSize: '96px',
            fill: isP1Winner ? '#ffff00' : '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: resultText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 800,
            ease: 'Back.easeOut'
        });

        // Winner character name
        const winnerChar = isP1Winner ? this.player1Char : this.player2Char;
        this.add.text(640, 320, `${winnerChar.toUpperCase()} WINS!`, {
            fontSize: '48px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Buttons
        this.createButtons();

        // Fullscreen button (top right)
        const fsBtn = this.add.text(1200, 30, '⛶', {
            fontSize: '36px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

        fsBtn.on('pointerover', () => {
            fsBtn.setStyle({ fill: '#ffaa00' });
            fsBtn.setScale(1.2);
        });

        fsBtn.on('pointerout', () => {
            fsBtn.setStyle({ fill: '#ffffff' });
            fsBtn.setScale(1);
        });

        fsBtn.on('pointerdown', () => {
            FullscreenManager.toggle(this);
        });

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Play sound
        this.sound.play(isP1Winner ? 'boss' : 'hit', { 
            volume: 0.5, 
            rate: isP1Winner ? 1.2 : 0.8 
        });
    }

    createButtons() {
        const buttons = [
            { 
                text: 'RETRY', 
                y: 480, 
                action: () => this.retry() 
            },
            { 
                text: 'SELECT CHARACTER', 
                y: 560, 
                action: () => this.selectCharacter() 
            },
            { 
                text: 'EXIT TO MENU', 
                y: 640, 
                action: () => this.exitToMenu() 
            }
        ];

        buttons.forEach(btn => {
            const button = this.add.text(640, btn.y, btn.text, {
                fontSize: '36px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

            button.on('pointerover', () => {
                button.setStyle({ fill: '#ffaa00' });
                button.setScale(1.1);
                this.playSound('hit', { volume: 0.2, rate: 2 });
            });

            button.on('pointerout', () => {
                button.setStyle({ fill: '#ffffff' });
                button.setScale(1);
            });

            button.on('pointerdown', () => {
                this.playSound('attack', { volume: 0.3 });
                this.cameras.main.fadeOut(300, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    btn.action();
                });
            });
        });
    }

    retry() {
        this.scene.start('BattleScene', {
            player1: this.player1Char,
            player2: this.player2Char
        });
    }

    selectCharacter() {
        this.scene.start('CharacterSelectScene');
    }

    exitToMenu() {
        this.sound.stopAll();
        this.scene.start('MainMenuScene');
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
