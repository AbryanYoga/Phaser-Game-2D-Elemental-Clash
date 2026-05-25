export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.hp = 100;
        this.maxHp = 100;
        this.isAttacking = false;
        this.isHurt = false;
        this.isDead = false;

        this.setCollideWorldBounds(true);
        // Align hitbox with center-bottom of knight sprite (128x128)
        this.body.setSize(50, 85);
        this.body.setOffset(39, 43);

        this.createAnimations();
        this.play('player_idle');

        // Mouse click attack trigger
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.isDead && !this.isHurt && !this.isAttacking && this.scene.scene.isActive('BattleScene')) {
                this.attack();
            }
        });
    }

    createAnimations() {
        const anims = this.scene.anims;
        if (!anims.exists('player_idle')) {
            anims.create({ key: 'player_idle', frames: anims.generateFrameNumbers('player_idle'), frameRate: 8, repeat: -1 });
            anims.create({ key: 'player_run', frames: anims.generateFrameNumbers('player_run'), frameRate: 12, repeat: -1 });
            anims.create({ key: 'player_attack', frames: anims.generateFrameNumbers('player_attack'), frameRate: 12, repeat: 0 });
            anims.create({ key: 'player_hurt', frames: anims.generateFrameNumbers('player_hurt'), frameRate: 8, repeat: 0 });
            anims.create({ key: 'player_dead', frames: anims.generateFrameNumbers('player_dead'), frameRate: 6, repeat: 0 });
            // Reuse frame 2 of running animation for jumping visual
            anims.create({ key: 'player_jump', frames: anims.generateFrameNumbers('player_run', { start: 2, end: 2 }), frameRate: 1, repeat: 0 });
        }
    }

    playSound(key, config = {}) {
        if (this.scene.registry.get('sfxEnabled') !== false) {
            this.scene.sound.play(key, config);
        }
    }

    update(cursors, keys) {
        if (this.isDead || this.isHurt) return;

        const onGround = this.body.blocked.down;

        if (this.isAttacking) {
            this.setVelocityX(0);
            return;
        }

        // Horizontal Movement
        if (keys.A.isDown) {
            this.setVelocityX(-250);
            this.setFlipX(true);
            if (onGround) this.play('player_run', true);
        } else if (keys.D.isDown) {
            this.setVelocityX(250);
            this.setFlipX(false);
            if (onGround) this.play('player_run', true);
        } else {
            this.setVelocityX(0);
            if (onGround) this.play('player_idle', true);
        }

        // Jump
        if (keys.SPACE.isDown && onGround) {
            this.setVelocityY(-600);
            this.play('player_jump', true);
            this.playSound('jump', { volume: 0.4 });
        }

        // J Key attack fallback
        if (Phaser.Input.Keyboard.JustDown(keys.J) && !this.isAttacking) {
            this.attack();
        }
    }

    attack() {
        this.isAttacking = true;
        this.play('player_attack');
        this.playSound('attack', { volume: 0.5 });
        
        // Custom event or hook to detect impact frame (e.g. frame 2 of attack)
        this.once('animationcomplete', () => {
            this.isAttacking = false;
        });

        // Trigger attack hit check in BattleScene
        this.scene.checkPlayerAttack();
    }

    takeDamage(amount) {
        if (this.isDead || this.isHurt) return;
        
        this.hp -= amount;
        this.isHurt = true;
        
        // Trigger red flash effect on player
        this.setTint(0xff0000);
        this.scene.cameras.main.shake(150, 0.01);
        this.playSound('hit', { volume: 0.4 });
        
        if (this.hp <= 0) {
            this.die();
        } else {
            this.play('player_hurt');
            this.scene.time.delayedCall(300, () => {
                this.isHurt = false;
                this.clearTint();
            });
        }
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.play('player_dead');
        this.setTint(0x7a0010);
        
        this.scene.time.delayedCall(1200, () => {
            this.scene.scene.start('GameOverScene', { result: 'YOU DIED' });
        });
    }
}
