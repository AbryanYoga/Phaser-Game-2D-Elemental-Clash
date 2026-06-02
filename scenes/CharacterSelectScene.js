/**
 * ELEMENTAL CLASH - Character Select Scene
 * Arcade-style character selection with KOF-style side-by-side bust previews and 2x2 grid
 */

import { FullscreenManager } from '../scripts/FullscreenManager.js';

export class CharacterSelectScene extends Phaser.Scene {
    constructor() {
        super('CharacterSelectScene');
    }

    create() {
        // 1. Draw retro background grid & scanlines
        const bgGraphics = this.add.graphics();
        bgGraphics.fillStyle(0x150303, 1); // very dark red
        bgGraphics.fillRect(0, 0, 1280, 720);
        
        // Diagonal grid lines
        bgGraphics.lineStyle(2, 0x3d0a0a, 0.4);
        const gridSize = 45;
        for (let x = -720; x < 1280; x += gridSize) {
            bgGraphics.lineBetween(x, 0, x + 720, 720);
        }
        for (let x = 0; x < 1280 + 720; x += gridSize) {
            bgGraphics.lineBetween(x, 0, x - 720, 720);
        }
        
        // Scanlines
        bgGraphics.fillStyle(0x000000, 0.12);
        for (let y = 0; y < 720; y += 4) {
            bgGraphics.fillRect(0, y, 1280, 2);
        }

        // 2. Character data
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
        this.currentIndex = 0; // Starts at Gale (index 0)

        // Background particles
        this.createBackgroundEffects();

        // 3. Grid Console Frame (Center)
        const gridFrame = this.add.graphics();
        // Outer dark metal frame
        gridFrame.fillStyle(0x1a0f0f, 0.7);
        gridFrame.fillRect(405, 165, 470, 410);
        gridFrame.lineStyle(6, 0xd47a00, 0.95); // glowing bronze/orange border
        gridFrame.strokeRect(405, 165, 470, 410);
        
        // Inner divider line
        gridFrame.lineStyle(2, 0xd47a00, 0.3);
        gridFrame.lineBetween(640, 165, 640, 575);
        gridFrame.lineBetween(405, 370, 875, 370);

        // 4. Large Bust Preview Setup (Left & Right Panels)
        // P1 Area (Left)
        this.p1IndicatorText = this.add.text(220, 110, '1 PLAYER', {
            fontSize: '28px',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.p1LargePortrait = this.add.image(220, 340, 'portrait_gale').setDisplaySize(320, 320);
        
        this.p1NameText = this.add.text(220, 520, 'GALE', {
            fontSize: '52px',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.p1ElementText = this.add.text(220, 580, 'WIND', {
            fontSize: '24px',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // P2 Area (Right)
        this.p2IndicatorText = this.add.text(1060, 110, '2 PLAYER', {
            fontSize: '28px',
            fill: '#ff3300',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        this.p2LargePortrait = this.add.image(1060, 340, 'portrait_homura').setDisplaySize(320, 320);
        this.p2LargePortrait.setFlipX(true);

        this.p2NameText = this.add.text(1060, 520, '???', {
            fontSize: '52px',
            fill: '#666666',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        this.p2ElementText = this.add.text(1060, 580, 'SELECTING...', {
            fontSize: '24px',
            fill: '#666666',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Initialize P2 shadow silhouette
        this.initP2Shadow();

        // 5. Create small grid cards
        this.createCharacterCards();

        // 6. Selector Boxes
        // P1 Selector (Cyan)
        this.p1SelectorBox = this.add.graphics();
        this.p1SelectorBox.lineStyle(5, 0x00ffff, 1);
        this.p1SelectorBox.strokeRect(-108, -88, 216, 176);
        this.p1SelectorBox.setDepth(5);
        
        // P2 Selector (Red)
        this.p2SelectorBox = this.add.graphics();
        this.p2SelectorBox.lineStyle(5, 0xff3300, 1);
        this.p2SelectorBox.strokeRect(-108, -88, 216, 176);
        this.p2SelectorBox.setDepth(5);
        this.p2SelectorBox.setVisible(false);

        // Pulsing selectors
        this.tweens.add({
            targets: [this.p1SelectorBox, this.p2SelectorBox],
            alpha: { from: 0.6, to: 1.0 },
            duration: 350,
            yoyo: true,
            repeat: -1
        });

        // 7. Header Title
        this.add.text(640, 70, 'SELECT YOUR FIGHTER', {
            fontSize: '54px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);

        // 8. Footer Instructions
        this.add.text(640, 650, 'WASD/Panah = Navigasi Grid  |  ENTER/SPACE = Pilih  |  Klik Portrait = Pilih', {
            fontSize: '20px',
            fill: '#888888',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Fullscreen button
        const fsBtn = this.add.text(1200, 30, '⛶', {
            fontSize: '36px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
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
        this.keys = this.input.keyboard.addKeys('W,S,A,D,ENTER,SPACE');

        // Apply initial hover positioning
        this.updateHoverState();

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }

    initP2Shadow() {
        this.p2LargePortrait.setTexture('portrait_homura'); // default model
        this.p2LargePortrait.setTint(0x000000);
        this.p2LargePortrait.setAlpha(0.45);
        this.p2NameText.setText('???');
        this.p2NameText.setStyle({ fill: '#666666' });
        this.p2ElementText.setText('SELECTING...');
        this.p2ElementText.setStyle({ fill: '#666666' });
    }

    createBackgroundEffects() {
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 1280 },
            y: { min: -50, max: 770 },
            speedY: { min: -30, max: -60 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.4, end: 0 },
            lifespan: 4000,
            frequency: 200,
            tint: [0x00ffff, 0xff3300, 0x00ff00, 0xaa8844]
        });
    }

    createCharacterCards() {
        // Grid position constants inside 470x410 frame centered at X=640, Y=370
        // Gale: X=520, Y=270
        // Homura: X=760, Y=270
        // Sylvan: X=520, Y=470
        // Terra: X=760, Y=470
        const positions = [
            { x: 520, y: 270 }, // index 0 (gale)
            { x: 760, y: 270 }, // index 1 (homura)
            { x: 520, y: 470 }, // index 2 (sylvan)
            { x: 760, y: 470 }  // index 3 (terra)
        ];

        this.characterCards = [];

        this.characters.forEach((char, index) => {
            const pos = positions[index];
            const card = this.add.container(pos.x, pos.y);

            // Card background (210x170)
            const cardBg = this.add.rectangle(0, 0, 210, 170, 0x120808, 0.85);
            cardBg.setStrokeStyle(3, 0x443333);
            card.add(cardBg);

            // Small Portrait (Bust image)
            const portrait = this.add.image(0, -10, char.portrait);
            portrait.setDisplaySize(140, 130);
            card.add(portrait);

            // Name
            const nameText = this.add.text(0, 60, char.name, {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 3
            }).setOrigin(0.5);
            card.add(nameText);

            // Element color strip at the bottom
            const elementStrip = this.add.rectangle(0, 81, 210, 8, char.color);
            card.add(elementStrip);

            // Make interactive
            cardBg.setInteractive({ useHandCursor: true });
            
            cardBg.on('pointerover', () => {
                // Ignore hover if selection is locked for P2 or if P1 has chosen and it's P2's turn
                if (this.currentSelector === 1 && this.selectedP1) return;
                if (this.currentSelector === 2 && this.selectedP2) return;

                this.currentIndex = index;
                this.updateHoverState();
                this.playSound('hit', { volume: 0.2, rate: 2 });
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
                index: index
            });
        });
    }

    updateHoverState() {
        const activeCard = this.characterCards[this.currentIndex];
        if (!activeCard) return;

        const targetX = activeCard.card.x;
        const targetY = activeCard.card.y;

        if (this.currentSelector === 1) {
            // Position P1 selector
            this.p1SelectorBox.setVisible(true);
            this.p1SelectorBox.setPosition(targetX, targetY);

            // Update P1 Preview
            this.updateP1Preview(activeCard.char);
        } else {
            // Position P2 selector
            this.p2SelectorBox.setVisible(true);
            this.p2SelectorBox.setPosition(targetX, targetY);

            // Update P2 Preview
            this.updateP2Preview(activeCard.char);
        }
    }

    updateP1Preview(char) {
        // Change large portrait
        this.p1LargePortrait.setTexture(char.portrait);
        this.p1LargePortrait.setAlpha(1);
        this.p1LargePortrait.clearTint();

        // Slide-in and fade-in animation from left
        this.p1LargePortrait.x = 120;
        this.p1LargePortrait.setAlpha(0);
        this.tweens.add({
            targets: this.p1LargePortrait,
            x: 220,
            alpha: 1,
            duration: 150,
            ease: 'Quad.easeOut'
        });

        // Update Text
        this.p1NameText.setText(char.name);
        this.p1NameText.setStyle({ fill: '#00ffff' });

        this.p1ElementText.setText(char.element.toUpperCase());
        this.p1ElementText.setStyle({ fill: Phaser.Display.Color.IntegerToColor(char.color).rgba });
    }

    updateP2Preview(char) {
        // Change large portrait (flipped)
        this.p2LargePortrait.setTexture(char.portrait);
        this.p2LargePortrait.setFlipX(true);
        this.p2LargePortrait.setAlpha(1);
        this.p2LargePortrait.clearTint();

        // Slide-in and fade-in animation from right
        this.p2LargePortrait.x = 1160;
        this.p2LargePortrait.setAlpha(0);
        this.tweens.add({
            targets: this.p2LargePortrait,
            x: 1060,
            alpha: 1,
            duration: 150,
            ease: 'Quad.easeOut'
        });

        // Update Text
        this.p2NameText.setText(char.name);
        this.p2NameText.setStyle({ fill: '#ff3300' });

        this.p2ElementText.setText(char.element.toUpperCase());
        this.p2ElementText.setStyle({ fill: Phaser.Display.Color.IntegerToColor(char.color).rgba });
    }

    selectCharacter(index) {
        const char = this.characters[index];
        const cardData = this.characterCards[index];

        this.playSound('attack', { volume: 0.4 });

        if (this.currentSelector === 1) {
            // Player 1 locks selection
            this.selectedP1 = char.key;

            // Lock P1 selector box position and color solid
            this.p1SelectorBox.setPosition(cardData.card.x, cardData.card.y);
            this.p1SelectorBox.setAlpha(1);

            // Add P1 tag indicator on card
            if (this.p1Indicator) this.p1Indicator.destroy();
            this.p1Indicator = this.add.text(cardData.card.x - 70, cardData.card.y - 50, '1P', {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#00ffff',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5).setDepth(10);

            // Flash camera green/cyan
            this.cameras.main.flash(200, 0, 255, 255, false);

            // Switch to P2 selection
            this.currentSelector = 2;
            
            // Set starting index for P2 to first available
            this.currentIndex = (index === 0) ? 1 : 0;
            
            // Show P2 selector box
            this.p2SelectorBox.setVisible(true);
            this.updateHoverState();

            this.p2Text = this.p2IndicatorText; // for backwards compatibility
            this.p1Text = this.p1IndicatorText;
            
            this.p2IndicatorText.setStyle({ fill: '#ff3300' });
            this.p1IndicatorText.setStyle({ fill: '#666666' });
        } else {
            // Player 2 locks selection
            if (char.key === this.selectedP1) {
                // Deny selecting same character
                this.cameras.main.shake(200, 0.01);
                this.playSound('hit', { volume: 0.5, rate: 0.5 });
                return;
            }

            this.selectedP2 = char.key;

            // Lock P2 selector box position and color solid
            this.p2SelectorBox.setPosition(cardData.card.x, cardData.card.y);
            this.p2SelectorBox.setAlpha(1);

            // Add P2 tag indicator on card
            if (this.p2Indicator) this.p2Indicator.destroy();
            this.p2Indicator = this.add.text(cardData.card.x + 70, cardData.card.y - 50, '2P', {
                fontSize: '20px',
                fill: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#ff3300',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5).setDepth(10);

            // Flash camera red
            this.cameras.main.flash(200, 255, 0, 0, false);

            // Start match transition
            this.startMatch();
        }
    }

    startMatch() {
        // Mixed color flash based on selections
        const p1Color = this.characters.find(c => c.key === this.selectedP1).color;
        const p2Color = this.characters.find(c => c.key === this.selectedP2).color;
        
        const c1 = Phaser.Display.Color.IntegerToColor(p1Color);
        const c2 = Phaser.Display.Color.IntegerToColor(p2Color);

        this.cameras.main.flash(800, 
            Math.floor((c1.red + c2.red) / 2),
            Math.floor((c1.green + c2.green) / 2),
            Math.floor((c1.blue + c2.blue) / 2),
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
        let navigated = false;
        let selected = false;

        // Gamepad navigation support
        const pad = this.input.gamepad.pad1;
        if (!this.padTimer) this.padTimer = 0;
        this.padTimer += this.game.loop.delta;

        if (pad && this.padTimer > 250) {
            const stickX = pad.axes[0] ? pad.axes[0].value : 0;
            const stickY = pad.axes[1] ? pad.axes[1].value : 0;

            if (pad.left || stickX < -0.5) {
                this.currentIndex = this.currentIndex % 2 === 0 ? this.currentIndex + 1 : this.currentIndex - 1;
                navigated = true;
                this.padTimer = 0;
            } else if (pad.right || stickX > 0.5) {
                this.currentIndex = this.currentIndex % 2 === 0 ? this.currentIndex + 1 : this.currentIndex - 1;
                navigated = true;
                this.padTimer = 0;
            } else if (pad.up || stickY < -0.5) {
                this.currentIndex = (this.currentIndex + 2) % 4;
                navigated = true;
                this.padTimer = 0;
            } else if (pad.down || stickY > 0.5) {
                this.currentIndex = (this.currentIndex + 2) % 4;
                navigated = true;
                this.padTimer = 0;
            }

            // A button (index 0) or Start button (index 9) to confirm select
            if (pad.A || (pad.buttons[0] && pad.buttons[0].pressed) || (pad.buttons[9] && pad.buttons[9].pressed)) {
                selected = true;
                this.padTimer = 0;
            }
        }

        // Keyboard grid navigation (WASD or Arrow Keys)
        if (Phaser.Input.Keyboard.JustDown(this.keys.A) || Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
            // Toggle column: 0 <-> 1, 2 <-> 3
            this.currentIndex = this.currentIndex % 2 === 0 ? this.currentIndex + 1 : this.currentIndex - 1;
            navigated = true;
        }
        // Right Navigation (D or Right arrow)
        else if (Phaser.Input.Keyboard.JustDown(this.keys.D) || Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
            // Toggle column: 0 <-> 1, 2 <-> 3
            this.currentIndex = this.currentIndex % 2 === 0 ? this.currentIndex + 1 : this.currentIndex - 1;
            navigated = true;
        }
        // Up Navigation (W or Up arrow)
        else if (Phaser.Input.Keyboard.JustDown(this.keys.W) || Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
            // Toggle row: Row 0 <-> Row 1
            this.currentIndex = (this.currentIndex + 2) % 4;
            navigated = true;
        }
        // Down Navigation (S or Down arrow)
        else if (Phaser.Input.Keyboard.JustDown(this.keys.S) || Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
            // Toggle row: Row 0 <-> Row 1
            this.currentIndex = (this.currentIndex + 2) % 4;
            navigated = true;
        }

        if (navigated) {
            this.updateHoverState();
            this.playSound('hit', { volume: 0.2, rate: 2 });
        }

        // Selection confirmation (ENTER, SPACE or Gamepad A)
        if (selected || Phaser.Input.Keyboard.JustDown(this.keys.ENTER) || Phaser.Input.Keyboard.JustDown(this.keys.SPACE)) {
            this.selectCharacter(this.currentIndex);
        }
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
