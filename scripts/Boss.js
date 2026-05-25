export class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss_idle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 500;
        this.maxHp = 500;
        this.isAttacking = false;
        this.isHurt = false;
        this.isDead = false;
        this.attackCooldown = 1500;
        this.nextAttackTime = 0;

        this.setCollideWorldBounds(true);
        // Align hitbox with center-bottom of boss sprite (128x128 before scale 2)
        this.body.setSize(70, 100);
        this.body.setOffset(29, 28);
        this.setScale(2); // Shadow Demon is big

        this.createAnimations();
        this.play('boss_idle');
    }

    createAnimations() {
        const anims = this.scene.anims;
        if (!anims.exists('boss_idle')) {
            anims.create({ key: 'boss_idle', frames: anims.generateFrameNumbers('boss_idle'), frameRate: 6, repeat: -1 });
            anims.create({ key: 'boss_run', frames: anims.generateFrameNumbers('boss_run'), frameRate: 10, repeat: -1 });
            anims.create({ key: 'boss_attack', frames: anims.generateFrameNumbers('boss_attack'), frameRate: 8, repeat: 0 });
            anims.create({ key: 'boss_hurt', frames: anims.generateFrameNumbers('boss_hurt'), frameRate: 6, repeat: 0 });
            anims.create({ key: 'boss_dead', frames: anims.generateFrameNumbers('boss_dead'), frameRate: 4, repeat: 0 });
        }
    }

    playSound(key, config = {}) {
        if (this.scene.registry.get('sfxEnabled') !== false) {
            this.scene.sound.play(key, config);
        }
    }

    update(player, time) {
        if (this.isDead || this.isHurt || this.isAttacking) return;

        // Face the player
        const dist = player.x - this.x;
        // FlipX determines orientation. Since sprite default faces right, if player is left (dist < 0), flipX = true.
        this.setFlipX(dist < 0);

        const absDist = Math.abs(dist);

        // Simple AI Chase and Attack
        if (absDist > 120) {
            // Chase Player
            this.setVelocityX(dist > 0 ? 120 : -120);
            this.play('boss_run', true);
        } else {
            // Arrived at Player
            this.setVelocityX(0);
            if (time > this.nextAttackTime) {
                this.attack(time);
            } else {
                this.play('boss_idle', true);
            }
        }
    }

    attack(time) {
        this.isAttacking = true;
        this.play('boss_attack');
        this.playSound('boss', { volume: 0.5 });

        this.once('animationcomplete', () => {
            this.isAttacking = false;
            this.nextAttackTime = time + this.attackCooldown;
        });

        // Trigger damage check in BattleScene at the swing frame (400ms delay)
        this.scene.time.delayedCall(300, () => {
            if (!this.isDead && this.isAttacking) {
                this.scene.checkBossAttack(20);
            }
        });
    }

    takeDamage(amount) {
        if (this.isDead || this.isHurt) return;

        this.hp -= amount;
        this.isHurt = true;

        // Trigger red hit flash
        this.setTint(0xff0000);
        this.scene.cameras.main.shake(120, 0.008);
        this.playSound('hit', { volume: 0.4 });

        if (this.hp <= 0) {
            this.die();
        } else {
            this.play('boss_hurt');
            this.scene.time.delayedCall(350, () => {
                this.isHurt = false;
                this.clearTint();
            });
        }
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.play('boss_dead');
        this.setTint(0x4a0e17);
        
        // Heavy screen shake on death
        this.scene.cameras.main.shake(500, 0.02);

        this.scene.time.delayedCall(1500, () => {
            this.scene.scene.start('GameOverScene', { result: 'VICTORY' });
        });
    }
}
