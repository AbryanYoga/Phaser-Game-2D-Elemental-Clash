import { Player } from '../scripts/Player.js';
import { Boss } from '../scripts/Boss.js';

export class BattleScene extends Phaser.Scene {
    constructor() {
        super('BattleScene');
    }

    create() {
        // World setup
        this.add.image(400, 300, 'background').setScrollFactor(0.2);
        
        // Ground (Invisible but physics-enabled)
        this.ground = this.add.rectangle(400, 550, 800, 100, 0x000000, 0);
        this.physics.add.existing(this.ground, true);

        // Characters
        this.player = new Player(this, 100, 450);
        this.boss = new Boss(this, 700, 450);

        // Physics
        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.boss, this.ground);

        // Controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('A,D,SPACE,J');

        // UI
        this.createUI();

        // Particles & Visual Effects
        this.createEffects();

        // Camera
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        this.cameras.main.setZoom(1.2);
        this.cameras.main.setBounds(0, 0, 800, 600);

        // BGM
        this.sound.play('bgm', { loop: true, volume: 0.3 });

        // Intro Cinematic
        this.introCinematic();
    }

    createUI() {
        // Player HP Bar
        this.playerHPBg = this.add.graphics();
        this.playerHPBg.fillStyle(0x000000, 0.5);
        this.playerHPBg.fillRect(20, 20, 200, 20).setScrollFactor(0);
        
        this.playerHPBar = this.add.graphics();
        this.updatePlayerHPBar();

        this.add.text(20, 45, 'HERO', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);

        // Boss HP Bar
        this.bossHPBg = this.add.graphics();
        this.bossHPBg.fillStyle(0x000000, 0.5);
        this.bossHPBg.fillRect(580, 20, 200, 20).setScrollFactor(0);
        
        this.bossHPBar = this.add.graphics();
        this.updateBossHPBar();

        this.add.text(730, 45, 'BOSS', { fontSize: '16px', fill: '#f00' }).setScrollFactor(0);
    }

    updatePlayerHPBar() {
        this.playerHPBar.clear();
        this.playerHPBar.fillStyle(0x00ff00, 1);
        const width = (this.player.hp / this.player.maxHp) * 200;
        this.playerHPBar.fillRect(20, 20, Math.max(0, width), 20).setScrollFactor(0);
    }

    updateBossHPBar() {
        this.bossHPBar.clear();
        this.bossHPBar.fillStyle(0xff0000, 1);
        const width = (this.boss.hp / this.boss.maxHp) * 200;
        this.bossHPBar.fillRect(580, 20, Math.max(0, width), 20).setScrollFactor(0);
    }

    createEffects() {
        // Fire/Ember particles
        this.particles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 800 },
            y: 600,
            speedY: { min: -100, max: -200 },
            speedX: { min: -50, max: 50 },
            scale: { start: 0.1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            frequency: 100,
            tint: 0xff4400,
            blendMode: 'ADD'
        });

        // Fog overlay
        this.fog = this.add.graphics();
        this.fog.fillStyle(0x000000, 0.2);
        this.fog.fillRect(0, 0, 800, 600).setScrollFactor(0);
    }

    introCinematic() {
        this.player.active = false;
        this.boss.active = false;
        
        const introText = this.add.text(400, 300, 'THE GUARDIAN AWAKES', {
            fontSize: '48px',
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
        this.updateBossHPBar();
    }

    checkPlayerAttack() {
        // Simple distance and facing check
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        const facingBoss = (this.player.flipX && this.player.x > this.boss.x) || (!this.player.flipX && this.player.x < this.boss.x);
        
        if (dist < 150 && facingBoss) {
            this.boss.takeDamage(10);
            this.showDamageText(this.boss.x, this.boss.y - 50, '10');
            this.createSlashEffect(this.boss.x, this.boss.y);
        }
    }

    checkBossAttack(damage) {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.boss.x, this.boss.y);
        if (dist < 200) {
            this.player.takeDamage(damage);
            this.showDamageText(this.player.x, this.player.y - 50, damage.toString(), '#ff0000');
        }
    }

    showDamageText(x, y, text, color = '#ffffff') {
        const dmgText = this.add.text(x, y, text, {
            fontSize: '24px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.tweens.add({
            targets: dmgText,
            y: y - 50,
            alpha: 0,
            duration: 800,
            onComplete: () => dmgText.destroy()
        });
    }

    createSlashEffect(x, y) {
        const slash = this.add.sprite(x, y, 'particle');
        slash.setScale(2);
        slash.setTint(0xffffff);
        this.tweens.add({
            targets: slash,
            scaleX: 0,
            alpha: 0,
            duration: 200,
            onComplete: () => slash.destroy()
        });
    }
}
