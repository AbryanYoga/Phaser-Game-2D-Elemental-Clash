/**
 * ELEMENTAL CLASH - Character Select Scene
 * Arcade-style character selection with REAL portraits
 */

import { FullscreenManager } from '../scripts/FullscreenManager.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        // Character data with REAL portraits
        this.characters = [
            { 
                key: 'gale', 
                name: 'GALE', 
                element: 'Wind',
                color: 0x00ffff,
                portrait: 'portrait_gale'
            },
            { 
                key: 'homura', 
                name: 'HOMURA', 
                element: 'Fire',
                color: 0xff3300,
                portrait: 'portrait_homura'
            },
            { 
                key: 'sylvan', 
                name: 'SYLVAN', 
                element: 'Nature',
                color: 0x00ff00,
                portrait: 'portrait_sylvan'
            },
            { 
                key: 'terra', 
                name: 'TERRA', 
                element: 'Earth',
                color: 0xaa8844,
                portrait: 'portrait_terra'
            }
        ];

        this.selectedP1 = null;
        this.selectedP2 = null;
        this.currentSelector = 1; // 1 = P1, 2 = P2
        this.currentIndex = 0; // For keyboard navigation

        // Background particles
        this.createBackgroundEffects();

        // Title
        this.add.text(640, 60, 'SELECT YOUR FIGHTER', {
            fontSize: '56px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // Player indicators
        this.p1Text = this.add.text(320, 140, 'PLAYER 1', {
            fontSize: '36px',
            fill: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.p2Text = this.add.text(960, 140, 'PLAYER 2', {
            fontSize: '36px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Create character portrait cards
        this.createCharacterCards();

        // Instructions
        this.add.text(640, 650, 'Click portrait to select  |  A/D or Arrow Keys to navigate  |  ENTER to confirm', {
            fontSize: '20px',
            fill: '#888888'
        }).setOrigin(0.5);

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

        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('A,D,ENTER');

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    createBackgroundEffects() {
        // Elemental particles
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 1280 },
            y: { min: -50, max: 770 },
            speedY: { min: -30, max: -60 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.5, end: 0 },
            lifespan: 4000,
            frequency: 250,
            tint: [0x00ffff, 0xff3300, 0x00ff00, 0xaa8844]
        });
    }

    createCharacterCards() {
        const startX = 160;
        const spacing = 280;
        const y = 380;

        this.characterCards = [];

        this.characters.forEach((char, index) => {
            const x = startX + (index * spacing);

            // Card container
            const card = this.add.container(x, y);

            // Card background with glow
            const cardBg = this.add.rectangle(0, 0, 240, 320, 0x1a1a2a, 1);
            cardBg.setStrokeStyle(4, 0x444444);
            card.add(cardBg);

            // Portrait image (REAL character face)
            const portrait = this.add.image(0, -40, char.portrait);
            portrait.setDisplaySize(200, 200);
            card.add(portrait);

            // Character name
            const nameText = this.add.text(0, 110, char.name, {
                fontSize: '28px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5);
            card.add(nameText);

            // Element text with color
            const elementText = this.add.text(0, 145, char.element, {
                fontSize: '20px',
                fill: Phaser.Display.Color.IntegerToColor(char.color).rgba,
                fontStyle: 'bold'
            }).setOrigin(0.5);
            card.add(elementText);

            // Glow effect (hidden initially)
            const glow = this.add.rectangle(0, 0, 250, 330, char.color, 0);
            glow.setStrokeStyle(6, char.color, 0);
            card.add(glow);
            card.sendToBack(glow);

            // Make interactive
            cardBg.setInteractive({ useHandCursor: true });

            cardBg.on('pointerover', () => {
                this.currentIndex = index;
                this.highlightCard(index);
                this.playSound('hit', { volume: 0.2, rate: 2 });
            });

            cardBg.on('pointerout', () => {
                if (this.selectedP1 !== char.key && this.selectedP2 !== char.key) {
                    this.unhighlightCard(index);
                }
            });

            cardBg.on('pointerdown', () => {
                this.selectCharacter(index);
            });

            this.characterCards.push({
                char: char,
                card: card,
                cardBg: cardBg,
                portrait: portrait,
                nameText: nameText,
                elementText: elementText,
                glow: glow,
                index: index
            });
        });

        // Highlight first card
        this.highlightCard(0);
    }

    highlightCard(index) {
        const cardData = this.characterCards[index];
        
        // Scale up
        this.tweens.add({
            targets: cardData.card,
            scale: 1.1,
            duration: 200,
            ease: 'Power2'
        });

        // Glow border
        cardData.cardBg.setStrokeStyle(4, cardData.char.color);
        
        // Subtle glow
        this.tweens.add({
            targets: cardData.glow,
            alpha: 0.2,
            duration: 200
        });
    }

    unhighlightCard(index) {
        const cardData = this.characterCards[index];
        
        // Scale down
        this.tweens.add({
            targets: cardData.card,
            scale: 1,
            duration: 200,
            ease: 'Power2'
        });

        // Remove glow
        cardData.cardBg.setStrokeStyle(4, 0x444444);
        
        this.tweens.add({
            targets: cardData.glow,
            alpha: 0,
            duration: 200
        });
    }

    selectCharacter(index) {
        const char = this.characters[index];
        const cardData = this.characterCards[index];

        this.playSound('attack', { volume: 0.4 });

        if (this.currentSelector === 1) {
            // Player 1 selection
            this.selectedP1 = char.key;
            
            // Lock selection with strong glow
            cardData.cardBg.setStrokeStyle(8, 0x00ff00);
            cardData.glow.setFillStyle(0x00ff00, 0.3);
            cardData.glow.setStrokeStyle(8, 0x00ff00, 1);

            // Add P1 indicator
            if (this.p1Indicator) this.p1Indicator.destroy();
            this.p1Indicator = this.add.text(cardData.card.x, cardData.card.y - 180, 'P1', {
                fontSize: '32px',
                fill: '#00ff00',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5);

            // Flash effect
            this.cameras.main.flash(200, 0, 255, 0, false);

            // Move to P2 selection
            this.currentSelector = 2;
            this.p2Text.setStyle({ fill: '#ffff00' });
            this.p1Text.setStyle({ fill: '#666666' });

        } else {
            // Player 2 selection
            if (char.key === this.selectedP1) {
                // Can't select same character
                this.cameras.main.shake(200, 0.01);
                this.playSound('hit', { volume: 0.5, rate: 0.5 });
                return;
            }

            this.selectedP2 = char.key;
            
            // Lock selection with strong glow
            cardData.cardBg.setStrokeStyle(8, 0xff0000);
            cardData.glow.setFillStyle(0xff0000, 0.3);
            cardData.glow.setStrokeStyle(8, 0xff0000, 1);

            // Add P2 indicator
            if (this.p2Indicator) this.p2Indicator.destroy();
            this.p2Indicator = this.add.text(cardData.card.x, cardData.card.y - 180, 'P2', {
                fontSize: '32px',
                fill: '#ff0000',
                fontStyle: 'bold',
                backgroundColor: '#000000',
                padding: { x: 15, y: 8 }
            }).setOrigin(0.5);

            // Flash effect
            this.cameras.main.flash(200, 255, 0, 0, false);

            // Both selected - start match
            this.startMatch();
        }
    }

    startMatch() {
        // Elemental flash effect based on characters
        const p1Color = this.characters.find(c => c.key === this.selectedP1).color;
        const p2Color = this.characters.find(c => c.key === this.selectedP2).color;
        
        // Mixed color flash
        this.cameras.main.flash(800, 
            Phaser.Display.Color.IntegerToColor(p1Color).red,
            Phaser.Display.Color.IntegerToColor(p2Color).green,
            Phaser.Display.Color.IntegerToColor(p1Color).blue,
            false
        );

        // Show "FIGHT!" text
        const fightText = this.add.text(640, 360, 'FIGHT!', {
            fontSize: '140px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 12
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: fightText,
            alpha: 1,
            scale: { from: 0.3, to: 1.5 },
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                this.cameras.main.fadeOut(400, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('BattleScene', {
                        player1: this.selectedP1,
                        player2: this.selectedP2
                    });
                });
            }
        });

        this.sound.play('boss', { volume: 0.7, rate: 1.3 });
    }

    update() {
        // Keyboard navigation
        if (Phaser.Input.Keyboard.JustDown(this.keys.A) || Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            this.navigateLeft();
        }
        
        if (Phaser.Input.Keyboard.JustDown(this.keys.D) || Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            this.navigateRight();
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.ENTER)) {
            this.selectCharacter(this.currentIndex);
        }
    }

    navigateLeft() {
        // Unhighlight current
        if (this.selectedP1 !== this.characters[this.currentIndex].key && 
            this.selectedP2 !== this.characters[this.currentIndex].key) {
            this.unhighlightCard(this.currentIndex);
        }

        // Move left
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.characters.length - 1;
        }

        // Highlight new
        this.highlightCard(this.currentIndex);
        this.playSound('hit', { volume: 0.2, rate: 2 });
    }

    navigateRight() {
        // Unhighlight current
        if (this.selectedP1 !== this.characters[this.currentIndex].key && 
            this.selectedP2 !== this.characters[this.currentIndex].key) {
            this.unhighlightCard(this.currentIndex);
        }

        // Move right
        this.currentIndex++;
        if (this.currentIndex >= this.characters.length) {
            this.currentIndex = 0;
        }

        // Highlight new
        this.highlightCard(this.currentIndex);
        this.playSound('hit', { volume: 0.2, rate: 2 });
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
