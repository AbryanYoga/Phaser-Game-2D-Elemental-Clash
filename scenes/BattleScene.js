/**
 * ELEMENTAL CLASH - Battle Scene
 * 1v1 arcade fighting arena
 */

import { Fighter } from '../scripts/Fighter.js';
import { FullscreenManager } from '../scripts/FullscreenManager.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    init(data) {
        this.player1Char = data.player1 || 'gale';
        this.player2Char = data.player2 || 'homura';
    }

    create() {
        // =========================================
        // BACKGROUND - BATTLEGROUND2 (LAYERED)
        // =========================================
        
        // Layer 1: Sky/Background (furthest)
        this.add.image(640, 360, 'bg_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0);
        
        // Layer 2: Mountains
        this.add.image(640, 360, 'mountains_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0.1);
        
        // Layer 3: Wall with windows
        this.add.image(640, 360, 'wall_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0.3);
        
        // Layer 4: Columns and flags
        this.add.image(640, 360, 'columns_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0.5);
        
        // Layer 5: Dragon decoration
        this.add.image(640, 360, 'dragon_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0.7);
        
        // Layer 6: Candeliar (foreground decoration)
        this.add.image(640, 360, 'candeliar_battleground2')
            .setDisplaySize(1280, 720)
            .setScrollFactor(0.9);

        // =========================================
        // PLATFORM - FLOOR
        // =========================================
        
        // Floor visual
        const floorY = 600;
        this.add.image(640, floorY, 'floor_battleground2')
            .setDisplaySize(1280, 200)
            .setOrigin(0.5, 0);
        
        // Platform physics (where characters stand)
        const platformY = 640;
        
        this.ground = this.physics.add.staticGroup();
        const platform = this.ground.create(640, platformY, 'floor_battleground2')
            .setDisplaySize(1280, 80)  // Increased height for better collision
            .setOrigin(0.5, 0)
            .setAlpha(0)
            .refreshBody();
        
        console.log('[BattleScene] Ground platform created at Y:', platformY, 'Size:', platform.displayWidth, 'x', platform.displayHeight);

        // =========================================
        // FIGHTERS
        // =========================================

        // Spawn positions - proper spacing
        this.player1 = new Fighter(this, 300, platformY, this.player1Char, true);
        this.player2 = new Fighter(this, 980, platformY, this.player2Char, false);
        
        // REMOVED: Don't counter gravity - let physics work naturally!
        // Characters will collide with ground properly

        // =========================================
        // COLLISION
        // =========================================

        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        // =========================================
        // WORLD
        // =========================================

        this.physics.world.setBounds(0, 0, 1280, 720);
        this.physics.world.gravity.y = 800;

        // =========================================
        // CONTROLS
        // =========================================

        // Keyboard controls
        this.keys = this.input.keyboard.addKeys('A,D,W,S,SPACE,J,K,L,SHIFT,CTRL,ESC');
        
        // DEBUG: Test keyboard registration
        console.log('[BattleScene] Keyboard keys registered:', {
            SPACE: this.keys.SPACE,
            K: this.keys.K,
            L: this.keys.L,
            SHIFT: this.keys.SHIFT,
            CTRL: this.keys.CTRL
        });
        
        // Mouse control flags
        this.player1LeftClick = false;
        this.player1RightClick = false;

        // Mouse input handlers - FIXED
        this.input.on('pointerdown', (pointer) => {
            if (this.isPaused) return;  // Ignore during pause
            
            if (pointer.leftButtonDown()) {
                this.player1LeftClick = true;
                console.log('[BattleScene] Left click detected');
            }
            if (pointer.rightButtonDown()) {
                this.player1RightClick = true;
                console.log('[BattleScene] Right click detected');
                pointer.event.preventDefault();  // Prevent context menu
            }
        });
        
        this.input.on('pointerup', () => {
            this.player1LeftClick = false;
            this.player1RightClick = false;
        });

        // Prevent right-click context menu globally
        this.input.mouse.disableContextMenu();

        // Pause menu flag
        this.isPaused = false;
        this.pauseMenu = null;

        // =========================================
        // UI
        // =========================================

        this.createUI();

        // =========================================
        // CAMERA
        // =========================================

        this.cameras.main.setZoom(1);
        this.cameras.main.setBounds(0, 0, 1280, 720);

        // =========================================
        // INTRO
        // =========================================

        this.showFightIntro();
    }

    createUI() {
        // Player 1 HP Bar
        this.p1HPBg = this.add.graphics();
        this.p1HPBg.fillStyle(0x000000, 0.7);
        this.p1HPBg.fillRect(30, 30, 400, 40).setScrollFactor(0);
        
        this.p1HPBar = this.add.graphics();
        
        this.add.text(30, 75, this.player1Char.toUpperCase(), { 
            fontSize: '20px', 
            fill: '#00ff00', 
            fontStyle: 'bold' 
        }).setScrollFactor(0);

        // Player 2 HP Bar
        this.p2HPBg = this.add.graphics();
        this.p2HPBg.fillStyle(0x000000, 0.7);
        this.p2HPBg.fillRect(850, 30, 400, 40).setScrollFactor(0);
        
        this.p2HPBar = this.add.graphics();
        
        this.add.text(1250, 75, this.player2Char.toUpperCase(), { 
            fontSize: '20px', 
            fill: '#ff0000', 
            fontStyle: 'bold' 
        }).setOrigin(1, 0).setScrollFactor(0);

        // Special cooldown bars
        this.p1SpecialBg = this.add.graphics();
        this.p1SpecialBg.fillStyle(0x000000, 0.5);
        this.p1SpecialBg.fillRect(30, 100, 200, 15).setScrollFactor(0);
        this.p1SpecialBar = this.add.graphics();

        this.p2SpecialBg = this.add.graphics();
        this.p2SpecialBg.fillStyle(0x000000, 0.5);
        this.p2SpecialBg.fillRect(1050, 100, 200, 15).setScrollFactor(0);
        this.p2SpecialBar = this.add.graphics();

        // Control guide (temporary)
        this.showControlGuide();
    }

    showControlGuide() {
        const guideBg = this.add.rectangle(640, 650, 1000, 120, 0x000000, 0.8).setScrollFactor(0);
        
        const guideText = this.add.text(640, 610, 'PLAYER 1 CONTROLS', {
            fontSize: '20px',
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        const controls1 = this.add.text(640, 645, 'A/D = Move  |  SPACE = Jump  |  LEFT CLICK = Attack/Combo  |  K = Special Attack (3rd Combo)', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        const controls2 = this.add.text(640, 670, 'RIGHT CLICK = Defend (70% reduction)  |  SHIFT/CTRL = Roll/Dodge (Invincible)', {
            fontSize: '16px',
            fill: '#ffffff'
        }).setOrigin(0.5).setScrollFactor(0);

        // Fade out after 8 seconds (longer to read)
        this.time.delayedCall(8000, () => {
            this.tweens.add({
                targets: [guideBg, guideText, controls1, controls2],
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    guideBg.destroy();
                    guideText.destroy();
                    controls1.destroy();
                    controls2.destroy();
                }
            });
        });
    }

    showFightIntro() {
        // Disable controls during intro
        this.player1.active = false;
        this.player2.active = false;

        const fightText = this.add.text(640, 360, 'FIGHT!', {
            fontSize: '120px',
            fill: '#ff0000',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0);

        this.tweens.add({
            targets: fightText,
            alpha: 1,
            scale: { from: 0.5, to: 1.2 },
            duration: 600,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: fightText,
                    alpha: 0,
                    scale: 1.5,
                    duration: 400,
                    delay: 400,
                    onComplete: () => {
                        fightText.destroy();
                        // CRITICAL: Enable controls after intro
                        this.player1.active = true;
                        this.player2.active = true;
                        console.log('[BattleScene] Fight intro complete! Players active:', this.player1.active, this.player2.active);
                    }
                });
            }
        });

        this.sound.play('boss', { volume: 0.6, rate: 1.2 });
    }

    update() {
        // ESC to pause
        if (Phaser.Input.Keyboard.JustDown(this.keys.ESC)) {
            this.togglePause();
        }

        if (this.isPaused) return;

        if (this.player1 && this.player1.active) {
            // FIXED: All controls properly mapped with DEBUG
            const p1Controls = {
                left: this.keys.A.isDown,
                right: this.keys.D.isDown,
                jump: Phaser.Input.Keyboard.JustDown(this.keys.SPACE),
                attack: this.player1LeftClick || Phaser.Input.Keyboard.JustDown(this.keys.J),
                special: Phaser.Input.Keyboard.JustDown(this.keys.K),
                defend: this.player1RightClick || this.keys.L.isDown,
                roll: Phaser.Input.Keyboard.JustDown(this.keys.SHIFT) || Phaser.Input.Keyboard.JustDown(this.keys.CTRL)
            };
            
            // DEBUG: Log when special keys are pressed
            if (p1Controls.jump) console.log('[BattleScene] SPACE pressed - jump:', p1Controls.jump);
            if (p1Controls.special) console.log('[BattleScene] K pressed - special:', p1Controls.special);
            if (p1Controls.defend) console.log('[BattleScene] RIGHT CLICK/L pressed - defend:', p1Controls.defend);
            if (p1Controls.roll) console.log('[BattleScene] SHIFT/CTRL pressed - roll:', p1Controls.roll);
            
            // Reset click flags after reading
            if (this.player1LeftClick) {
                this.player1LeftClick = false;
            }
            
            this.player1.update(p1Controls);
        }

        if (this.player2 && this.player2.active) {
            // Simple AI for Player 2
            this.updateAI();
        }

        this.updateUI();
    }

    updateAI() {
        const dist = this.player1.x - this.player2.x;
        const absDist = Math.abs(dist);

        const p2Controls = {
            left: false,
            right: false,
            jump: false,
            attack: false,
            special: false,
            defend: false,
            roll: false
        };

        // Chase player
        if (absDist > 150) {
            if (dist > 0) {
                p2Controls.right = true;
            } else {
                p2Controls.left = true;
            }
        }

        // Defend when player attacks
        if (this.player1.isAttacking && absDist < 200 && Math.random() < 0.3) {
            p2Controls.defend = true;
        }

        // Roll/dodge occasionally
        if (absDist < 250 && Math.random() < 0.01 && this.player2.rollCooldown <= 0) {
            p2Controls.roll = true;
        }

        // Attack when close
        if (absDist < 180 && Math.random() < 0.03) {
            p2Controls.attack = true;
        }

        // Special attack occasionally
        if (absDist < 200 && Math.random() < 0.008 && this.player2.specialCooldown <= 0) {
            p2Controls.special = true;
        }

        this.player2.update(p2Controls);
    }

    updateUI() {
        // Player 1 HP
        this.p1HPBar.clear();
        const p1Percent = this.player1.hp / this.player1.maxHp;
        this.p1HPBar.fillStyle(p1Percent > 0.3 ? 0x00ff00 : 0xff0000, 1);
        this.p1HPBar.fillRect(30, 30, 400 * p1Percent, 40).setScrollFactor(0);

        // Player 2 HP
        this.p2HPBar.clear();
        const p2Percent = this.player2.hp / this.player2.maxHp;
        this.p2HPBar.fillStyle(p2Percent > 0.3 ? 0x00ff00 : 0xff0000, 1);
        const p2Width = 400 * p2Percent;
        this.p2HPBar.fillRect(850 + (400 - p2Width), 30, p2Width, 40).setScrollFactor(0);

        // Special cooldowns
        this.p1SpecialBar.clear();
        const p1Special = this.player1.getSpecialCooldownPercent();
        this.p1SpecialBar.fillStyle(p1Special >= 1 ? 0xffaa00 : 0x666666, 1);
        this.p1SpecialBar.fillRect(30, 100, 200 * p1Special, 15).setScrollFactor(0);

        this.p2SpecialBar.clear();
        const p2Special = this.player2.getSpecialCooldownPercent();
        this.p2SpecialBar.fillStyle(p2Special >= 1 ? 0xffaa00 : 0x666666, 1);
        this.p2SpecialBar.fillRect(1050, 100, 200 * p2Special, 15).setScrollFactor(0);
    }

    checkAttack(attacker, damage, isSpecial) {
        const defender = attacker === this.player1 ? this.player2 : this.player1;
        
        const dist = Phaser.Math.Distance.Between(attacker.x, attacker.y, defender.x, defender.y);
        const facingDefender = (attacker.flipX && attacker.x > defender.x) || 
                               (!attacker.flipX && attacker.x < defender.x);

        // Scale the attack range based on the character scale compared to default 1.5
        const scaleMultiplier = (attacker.characterScale || 1.5) / 1.5;
        const range = (isSpecial ? 200 : 160) * scaleMultiplier;
        
        if (dist < range && facingDefender) {
            defender.takeDamage(damage);
            const textYOffset = 80 * scaleMultiplier;
            this.showDamageText(defender.x, defender.y - textYOffset, `-${damage}`, isSpecial ? '#ffaa00' : '#ffffff');
            this.createHitEffect(defender.x, defender.y, isSpecial);
        }
    }

    showDamageText(x, y, text, color) {
        const dmgText = this.add.text(x, y, text, {
            fontSize: '36px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5);

        this.tweens.add({
            targets: dmgText,
            y: y - 60,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => dmgText.destroy()
        });
    }

    createHitEffect(x, y, isSpecial) {
        const flash = this.add.graphics();
        flash.fillStyle(isSpecial ? 0xffaa00 : 0xffffff, 0.7);
        flash.fillCircle(x, y, isSpecial ? 70 : 50);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 250,
            onComplete: () => flash.destroy()
        });
    }

    endMatch(winner) {
        this.player1.active = false;
        this.player2.active = false;

        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ResultScene', { 
                winner: winner,
                player1: this.player1Char,
                player2: this.player2Char
            });
        });
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        this.isPaused = true;
        this.physics.pause();
        this.sound.pauseAll();

        // Create pause menu
        this.pauseMenu = this.add.container(0, 0).setDepth(9999).setScrollFactor(0);

        // Dark overlay
        const overlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);
        this.pauseMenu.add(overlay);

        // Title
        const title = this.add.text(640, 200, 'PAUSED', {
            fontSize: '72px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);
        this.pauseMenu.add(title);

        // Menu options
        const menuOptions = [
            { text: 'RESUME', action: () => this.resumeGame() },
            { text: 'FULLSCREEN', action: () => FullscreenManager.toggle(this) },
            { text: 'MAIN MENU', action: () => this.returnToMenu() }
        ];

        const startY = 350;
        const spacing = 80;

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

            btn.on('pointerover', () => {
                btn.setStyle({ fill: '#ffaa00' });
                btn.setScale(1.1);
            });

            btn.on('pointerout', () => {
                btn.setStyle({ fill: '#ffffff' });
                btn.setScale(1);
            });

            btn.on('pointerdown', () => {
                option.action();
            });

            this.pauseMenu.add(btn);
        });

        // ESC hint
        const hint = this.add.text(640, 600, 'Press ESC to Resume', {
            fontSize: '20px',
            fill: '#888888',
            fontStyle: 'italic'
        }).setOrigin(0.5);
        this.pauseMenu.add(hint);
    }

    resumeGame() {
        this.isPaused = false;
        this.physics.resume();
        this.sound.resumeAll();

        if (this.pauseMenu) {
            this.pauseMenu.destroy();
            this.pauseMenu = null;
        }
    }

    returnToMenu() {
        this.sound.stopAll();
        this.scene.start('MainMenuScene');
    }
}
