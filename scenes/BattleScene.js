import { Player } from '../scripts/Player.js';
import { Boss } from '../scripts/Boss.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    create() {
    // =========================================
    // BACKGROUND - THRONE ROOM LAYERS
    // =========================================
    
    // Throne room background
    this.add.image(640, 360, 'background')
        .setDisplaySize(1280, 720)
        .setScrollFactor(0);
    
    // Layer 1 (paling belakang)
    this.add.image(640, 360, 'map_layer_1')
        .setDisplaySize(1280, 720)
        .setScrollFactor(0.1);
    
    // Layer 2
    this.add.image(640, 360, 'map_layer_2')
        .setDisplaySize(1280, 720)
        .setScrollFactor(0.3);
    
    // Layer 3
    this.add.image(640, 360, 'map_layer_3')
        .setDisplaySize(1280, 720)
        .setScrollFactor(0.5);
    
    // Layer 4
    this.add.image(640, 360, 'map_layer_4')
        .setDisplaySize(1280, 720)
        .setScrollFactor(0.7);

    // =========================================
    // PLATFORM - GAMBAR 5 SEBAGAI PIJAKAN
    // =========================================
    
    const platformY = 640;  // Posisi Y karakter (pas dengan 5.png)
    
    // Visual platform (gambar 5) - positioned lower
    this.add.image(640, 600, 'platform')
        .setDisplaySize(1280, 200)
        .setOrigin(0.5, 0);  // Origin di atas
    
    // Physics platform - untuk collision detection
    this.ground = this.physics.add.staticGroup();
    this.ground.create(640, platformY, 'platform')
        .setDisplaySize(1280, 40)
        .setOrigin(0.5, 0)
        .setAlpha(0)  // Invisible
        .refreshBody();

    // =========================================
    // PLAYER
    // =========================================

    // Spawn di platform (di atas 5.png)
    this.player = new Player(this, 250, platformY);
    
    // Gravity counter agar tidak jatuh
    this.player.body.setGravityY(-800);

    // =========================================
    // BOSS
    // =========================================

    // Spawn di platform (di atas 5.png)
    this.boss = new Boss(this, 1000, platformY);
    
    // Gravity counter agar tidak jatuh
    this.boss.body.setGravityY(-800);

    // =========================================
    // COLLISION
    // =========================================

    // Simple collider - karakter berdiri di platform
    this.physics.add.collider(this.player, this.ground);
    this.physics.add.collider(this.boss, this.ground);

    // =========================================
    // WORLD
    // =========================================

    this.physics.world.setBounds(0, 0, 1280, 720);

    // Gravity - normal untuk jump yang bekerja
    this.physics.world.gravity.y = 800;

    // =========================================
    // CONTROLS
    // =========================================

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('A,D,SPACE,J,F,K');

    // =========================================
    // UI
    // =========================================

    this.createUI();
    this.createEffects();

    // =========================================
    // CAMERA
    // =========================================

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    this.cameras.main.setZoom(1);

    this.cameras.main.setBounds(0, 0, 1280, 720);

    // =========================================
    // BGM
    // =========================================

    if (!this.sound.get('bgm')) {
        this.sound.play('bgm', {
            loop: true,
            volume: 0.3
        });
    }

    // =========================================
    // INTRO
    // =========================================

    this.introCinematic();
}

    createUI() {
        // Player HP Bar
        this.playerHPBg = this.add.graphics();
        this.playerHPBg.fillStyle(0x000000, 0.5);
        this.playerHPBg.fillRect(30, 30, 300, 30).setScrollFactor(0);
        
        this.playerHPBar = this.add.graphics();
        this.updatePlayerHPBar();

        this.add.text(30, 65, 'ARKA', { fontSize: '20px', fill: '#fff', fontStyle: 'bold' }).setScrollFactor(0);
        
        // Damage taken indicator
        this.damageIndicator = this.add.text(180, 65, '', {
            fontSize: '18px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setAlpha(0);

        // Special Attack Cooldown Bar
        this.specialCDBg = this.add.graphics();
        this.specialCDBg.fillStyle(0x000000, 0.5);
        this.specialCDBg.fillRect(30, 100, 250, 20).setScrollFactor(0);
        
        this.specialCDBar = this.add.graphics();
        
        this.specialCDText = this.add.text(30, 125, 'Serangan Khusus [F/K]', { 
            fontSize: '16px', 
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setScrollFactor(0);

        // Boss HP Bar
        this.bossHPBg = this.add.graphics();
        this.bossHPBg.fillStyle(0x000000, 0.5);
        this.bossHPBg.fillRect(950, 30, 300, 30).setScrollFactor(0);
        
        this.bossHPBar = this.add.graphics();
        this.updateBossHPBar();

        this.add.text(1000, 65, 'BATHARA KALA', { fontSize: '18px', fill: '#f00', fontStyle: 'bold' }).setScrollFactor(0);
        
        // =========================================
        // CONTROLS GUIDE - PANDUAN KONTROL
        // =========================================
        
        const controlsBg = this.add.graphics();
        controlsBg.fillStyle(0x000000, 0.7);
        controlsBg.fillRect(30, 600, 360, 100).setScrollFactor(0);
        
        this.add.text(40, 610, 'KONTROL PERMAINAN:', {
            fontSize: '16px',
            fill: '#ffaa00',
            fontStyle: 'bold'
        }).setScrollFactor(0);
        
        this.add.text(40, 635, 'A / D - Bergerak Kiri/Kanan', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setScrollFactor(0);
        
        this.add.text(40, 655, 'Klik Kiri - Serang', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setScrollFactor(0);
        
        this.add.text(40, 675, 'F / K - Serangan Khusus', {
            fontSize: '14px',
            fill: '#ffffff'
        }).setScrollFactor(0);
        
        // Fade out controls after 8 seconds
        this.time.delayedCall(8000, () => {
            this.tweens.add({
                targets: [controlsBg],
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    controlsBg.destroy();
                }
            });
            
            // Fade out all control texts
            const controlTexts = this.children.list.filter(child => 
                child.type === 'Text' && 
                child.y >= 610 && 
                child.y <= 680
            );
            
            this.tweens.add({
                targets: controlTexts,
                alpha: 0,
                duration: 1000,
                onComplete: () => {
                    controlTexts.forEach(text => text.destroy());
                }
            });
        });
    }

    updatePlayerHPBar() {
        this.playerHPBar.clear();
        
        // HP bar color based on health percentage
        const hpPercent = this.player.hp / this.player.maxHp;
        let barColor = 0x00ff00; // Green
        if (hpPercent < 0.3) {
            barColor = 0xff0000; // Red
        } else if (hpPercent < 0.6) {
            barColor = 0xffaa00; // Orange
        }
        
        this.playerHPBar.fillStyle(barColor, 1);
        const width = hpPercent * 300;
        this.playerHPBar.fillRect(30, 30, Math.max(0, width), 30).setScrollFactor(0);
        
        // Add HP text
        if (!this.playerHPText) {
            this.playerHPText = this.add.text(180, 45, '', {
                fontSize: '16px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setScrollFactor(0);
        }
        this.playerHPText.setText(`${Math.max(0, Math.floor(this.player.hp))}/${this.player.maxHp}`);
    }

    updateSpecialCDBar() {
        this.specialCDBar.clear();
        const percent = this.player.getSpecialCooldownPercent();
        
        if (percent >= 1) {
            this.specialCDBar.fillStyle(0xffaa00, 1);
            this.specialCDText.setColor('#ffaa00');
            this.specialCDText.setText('Serangan Khusus [F/K] SIAP!');
        } else {
            this.specialCDBar.fillStyle(0x666666, 1);
            this.specialCDText.setColor('#888888');
            const timeLeft = Math.ceil(this.player.specialCooldown / 1000);
            this.specialCDText.setText(`Serangan Khusus [F/K] ${timeLeft}d`);
        }
        
        const width = percent * 250;
        this.specialCDBar.fillRect(30, 100, Math.max(0, width), 20).setScrollFactor(0);
    }

    updateBossHPBar() {
        this.bossHPBar.clear();
        
        // Boss HP bar color based on health
        const hpPercent = this.boss.hp / this.boss.maxHp;
        let barColor = 0xff0000; // Red
        if (hpPercent < 0.3) {
            barColor = 0xff6600; // Dark orange when low
        }
        
        this.bossHPBar.fillStyle(barColor, 1);
        const width = hpPercent * 300;
        this.bossHPBar.fillRect(950, 30, Math.max(0, width), 30).setScrollFactor(0);
        
        // Add Boss HP text
        if (!this.bossHPText) {
            this.bossHPText = this.add.text(1100, 45, '', {
                fontSize: '16px',
                fill: '#fff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setScrollFactor(0);
        }
        this.bossHPText.setText(`${Math.max(0, Math.floor(this.boss.hp))}/${this.boss.maxHp}`);
    }

    createEffects() {
        // Fog overlay only
        this.fog = this.add.graphics();
        this.fog.fillStyle(0x000000, 0.2);
        this.fog.fillRect(0, 0, 1280, 720).setScrollFactor(0);
    }

    introCinematic() {
        this.player.active = false;
        this.boss.active = false;
        
        const introText = this.add.text(640, 360, 'BATHARA KALA BANGKIT', {
            fontSize: '64px',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setScrollFactor(0);

        this.tweens.add({
            targets: introText,
            alpha: 1,
            duration: 1000,
            yoyo: true,
            hold: 1000,
            onComplete: () => {
                this.player.active = true;
                this.boss.active = true;
                introText.destroy();
            }
        });
    }

    update(time) {
        if (this.player.active) {
            this.player.update(this.cursors, this.keys);
        }
        if (this.boss.active) {
            this.boss.update(this.player, time);
        }

        this.updatePlayerHPBar();
        this.updateSpecialCDBar();
        this.updateBossHPBar();
    }

    checkPlayerAttack(damage = 35, isSpecial = false) {
        // Simple distance and facing check
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        const facingBoss = (this.player.flipX && this.player.x > this.boss.x) || (!this.player.flipX && this.player.x < this.boss.x);

        if (isSpecial) {
            damage = 35;
        } else {
            damage = 20;
        }
        
        const range = isSpecial ? 180 : 150;
        
        if (dist < range && facingBoss) {
            // Critical hit chance (15%)
            const isCritical = !isSpecial && Math.random() < 0.15;
            let finalDamage = damage;
            let damageColor = '#ffffff';
            
            if (isSpecial) {
                damageColor = '#ff4400'; // Red for special
            } else if (isCritical) {
                finalDamage = Math.floor(damage * 1.5);
                damageColor = '#ffff00'; // Yellow for critical
            }
            
            this.boss.takeDamage(finalDamage);
            this.showDamageText(this.boss.x, this.boss.y - 50, finalDamage.toString(), damageColor, isCritical || isSpecial);
            this.createSlashEffect(this.boss.x, this.boss.y, isSpecial || isCritical);
        }
    }

    checkBossAttack(damage) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        if (dist < 200) {
            this.player.takeDamage(damage);
            // Show damage with bigger, more visible text
            this.showDamageText(this.player.x, this.player.y - 80, `-${damage}`, '#ff0000', true);
            
            // Flash damage indicator in UI
            this.damageIndicator.setText(`-${damage} HP!`);
            this.damageIndicator.setAlpha(1);
            this.tweens.add({
                targets: this.damageIndicator,
                alpha: 0,
                duration: 1000,
                ease: 'Power2'
            });
            
            // Blood effect removed - too distracting
        }
    }

    showDamageText(x, y, text, color = '#ffffff', isBig = false) {
        const dmgText = this.add.text(x, y, text, {
            fontSize: isBig ? '32px' : '24px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: isBig ? 6 : 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: dmgText,
            y: y - (isBig ? 70 : 50),
            alpha: 0,
            duration: isBig ? 1000 : 800,
            ease: 'Power2',
            onComplete: () => dmgText.destroy()
        });
    }

    createSlashEffect(x, y, isSpecial = false) {
        // Simple flash effect without particles
        const flash = this.add.graphics();
        flash.fillStyle(isSpecial ? 0xffaa00 : 0xffffff, isSpecial ? 0.8 : 0.6);
        flash.fillCircle(x, y, isSpecial ? 60 : 40);
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: isSpecial ? 300 : 200,
            onComplete: () => flash.destroy()
        });
    }
    
    showGameOver(result) {
        // Fade out
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.sound.stopAll();
            this.scene.start('GameOverScene', { 
                result: result === 'victory' ? 'VICTORY' : 'DEFEAT'
            });
        });
    }
    
    playSound(key, config = {}) {
        if (this.registry.get('sfxEnabled') !== false) {
            try {
                if (this.sound.get(key)) {
                    this.sound.play(key, config);
                }
            } catch (e) {
                console.warn('Sound not found:', key);
            }
        }
    }
}
