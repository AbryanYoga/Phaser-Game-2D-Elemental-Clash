export class Boss extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'boss_idle_1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 500;
        this.maxHp = 500;
        this.isAttacking = false;
        this.isHurt = false;
        this.isDead = false;
        this.attackCooldown = 2200;
        this.nextAttackTime = 0;
        this.attackPauseTime = 0;

        // Set origin to bottom center
        this.setOrigin(0.5, 1);
        
        // Physics body
        this.body.setSize(80, 110);
        this.body.setOffset(35, 18);
        this.body.setBounce(0, 0);
        this.body.setDrag(0.99, 0);
        
        this.setScale(1.2);  // Reduced scale so it fits on screen
        this.setCollideWorldBounds(true);

        this.createAnimations();
        this.play('boss_idle');
    }

    createAnimations() {
        const anims = this.scene.anims;
        
        // Idle Animation (4 frames)
        if (!anims.exists('boss_idle')) {
            anims.create({ 
                key: 'boss_idle', 
                frames: [
                    { key: 'boss_idle_1' },
                    { key: 'boss_idle_2' },
                    { key: 'boss_idle_3' },
                    { key: 'boss_idle_4' }
                ], 
                frameRate: 6, 
                repeat: -1 
            });
        }
        
        // Run Animation (5 frames)
        if (!anims.exists('boss_run')) {
            anims.create({ 
                key: 'boss_run', 
                frames: [
                    { key: 'boss_run_1' },
                    { key: 'boss_run_2' },
                    { key: 'boss_run_3' },
                    { key: 'boss_run_4' },
                    { key: 'boss_run_5' }
                ], 
                frameRate: 10, 
                repeat: -1 
            });
        }
        
        // Attack Animation (4 frames)
        if (!anims.exists('boss_attack')) {
            anims.create({ 
                key: 'boss_attack', 
                frames: [
                    { key: 'boss_attack_1' },
                    { key: 'boss_attack_2' },
                    { key: 'boss_attack_3' },
                    { key: 'boss_attack_4' }
                ], 
                frameRate: 10, 
                repeat: 0 
            });
        }
        
        // Hurt Animation (2 frames)
        if (!anims.exists('boss_hurt')) {
            anims.create({ 
                key: 'boss_hurt', 
                frames: [
                    { key: 'boss_hurt_1' },
                    { key: 'boss_hurt_2' }
                ], 
                frameRate: 8, 
                repeat: 0 
            });
        }
        
        // Dead Animation (3 frames)
        if (!anims.exists('boss_dead')) {
            anims.create({ 
                key: 'boss_dead', 
                frames: [
                    { key: 'boss_dead_1' },
                    { key: 'boss_dead_2' },
                    { key: 'boss_dead_3' }
                ], 
                frameRate: 5, 
                repeat: 0 
            });
        }
    }

    playSound(key, config = {}) {
        if (this.scene.registry.get('sfxEnabled') !== false) {
            this.scene.sound.play(key, config);
        }
    }

    update(player, time) {
        if (this.isDead || this.isHurt || this.isAttacking) {
            this.setVelocityX(this.body.velocity.x * 0.85);
            return;
        }

        // Pause after attacking
        if (time < this.attackPauseTime) {
            this.setVelocityX(0);
            this.play('boss_idle', true);
            return;
        }

        // Face the player
        const dist = player.x - this.x;
        this.setFlipX(dist < 0);

        const absDist = Math.abs(dist);

        // Slower AI movement
        const maxSpeed = 110;
        const acceleration = 12;
        
        if (absDist > 130) {
            // Chase Player with smooth acceleration
            const targetVelX = dist > 0 ? maxSpeed : -maxSpeed;
            const currentVelX = this.body.velocity.x;
            
            if (Math.abs(targetVelX - currentVelX) > acceleration) {
                const newVelX = currentVelX + (targetVelX > currentVelX ? acceleration : -acceleration);
                this.setVelocityX(newVelX);
            } else {
                this.setVelocityX(targetVelX);
            }
            
            this.play('boss_run', true);
        } else {
            // Arrived at Player - smooth deceleration
            this.setVelocityX(this.body.velocity.x * 0.8);
            
            if (Math.abs(this.body.velocity.x) < 10) {
                this.setVelocityX(0);
            }
            
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
            this.attackPauseTime = time + 800;
        });

        // Trigger damage check in BattleScene at the swing frame (350ms delay)
        this.scene.time.delayedCall(350, () => {
            if (!this.isDead && this.isAttacking) {
                this.scene.checkBossAttack(12);
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
            // Smooth knockback
            this.setVelocityX(this.flipX ? -80 : 80);
            this.scene.time.delayedCall(400, () => {
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
            this.scene.showGameOver('victory');
        });
    }
}
