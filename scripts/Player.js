export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'player_idle_1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Stats
        this.hp = 150;
        this.maxHp = 150;

        // State flags - STRICT PRIORITY ORDER
        this.isDead = false;           // Priority 1: Dead
        this.isHurt = false;           // Priority 2: Hurt
        this.isAttacking = false;      // Priority 3: Attack
        this.isSpecialAttacking = false;
        this.isInvincible = false;

        // Cooldowns
        this.specialCooldown = 0;
        this.specialCooldownTime = 4000;

        // Animation state manager
        this.animationState = {
            current: 'idle',
            previous: '',
            locked: false,
            lockTimer: null
        };

        // SINGLE PHYSICS SETUP - NO DUPLICATES
        this.setOrigin(0.5, 1);
        this.body.setSize(60, 100);
        this.body.setOffset(35, 28);
        this.body.setBounce(0, 0);
        this.body.setGravityY(-1200); // Counter world gravity
        this.setScale(1.2);
        this.setCollideWorldBounds(true);

        // ALWAYS KEEP FULLY VISIBLE
        this.alpha = 1;

        // Validate and create animations
        this.validateTextures();
        this.createAnimations();

        // Start with idle
        this.changeAnimation('idle');

        // Mouse click attack
        this.scene.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown() && !this.isDead && !this.isHurt && !this.isAttacking && !this.isSpecialAttacking && this.scene.scene.isActive('BattleScene')) {
                this.attack();
            }
        });

        console.log('[Player] Initialized successfully');
    }

    validateTextures() {
        console.log('[Player] Validating textures...');
        
        const requiredTextures = [
            'player_idle_1', 'player_idle_2', 'player_idle_3', 'player_idle_4', 'player_idle_5',
            'player_run_1', 'player_run_2', 'player_run_3', 'player_run_4', 'player_run_5', 'player_run_6',
            'player_jump_1', 'player_jump_2', 'player_jump_3', 'player_jump_4',
            'player_attack_1', 'player_attack_2', 'player_attack_3', 'player_attack_4', 'player_attack_5',
            'player_dead', 'player_win'
        ];

        let allValid = true;
        let missingTextures = [];
        
        requiredTextures.forEach(key => {
            const exists = this.scene.textures.exists(key);
            if (!exists) {
                console.error(`[Player] Missing texture: ${key}`);
                missingTextures.push(key);
                allValid = false;
            }
        });

        if (allValid) {
            console.log('[Player] All textures validated ✓');
        } else {
            console.error('[Player] Missing textures:', missingTextures);
        }

        return allValid;
    }

    createAnimations() {
        const anims = this.scene.anims;
        console.log('[Player] Creating animations...');

        // IDLE - 5 frames, looping
        if (!anims.exists('idle')) {
            anims.create({
                key: 'idle',
                frames: [
                    { key: 'player_idle_1' },
                    { key: 'player_idle_2' },
                    { key: 'player_idle_3' },
                    { key: 'player_idle_4' },
                    { key: 'player_idle_5' }
                ],
                frameRate: 8,
                repeat: -1
            });
            console.log('[Player] Created: idle');
        }

        // RUN - 6 frames, looping at 15 FPS
        // Force remove if exists (cache issue)
        if (anims.exists('run')) {
            anims.remove('run');
            console.log('[Player] Removed old run animation');
        }
        
        anims.create({
            key: 'run',
            frames: [
                { key: 'player_run_1' },
                { key: 'player_run_2' },
                { key: 'player_run_3' },
                { key: 'player_run_4' },
                { key: 'player_run_5' },
                { key: 'player_run_6' }
            ],
            frameRate: 15,
            repeat: -1
        });
        console.log('[Player] Created: run (6 frames, 15 FPS)');

        // JUMP - 4 frames, NO REPEAT
        if (!anims.exists('jump')) {
            anims.create({
                key: 'jump',
                frames: [
                    { key: 'player_jump_1' },
                    { key: 'player_jump_2' },
                    { key: 'player_jump_3' },
                    { key: 'player_jump_4' }
                ],
                frameRate: 10,
                repeat: 0
            });
            console.log('[Player] Created: jump');
        }

        // ATTACK - 5 frames, NO REPEAT
        if (!anims.exists('attack')) {
            anims.create({
                key: 'attack',
                frames: [
                    { key: 'player_attack_1' },
                    { key: 'player_attack_2' },
                    { key: 'player_attack_3' },
                    { key: 'player_attack_4' },
                    { key: 'player_attack_5' }
                ],
                frameRate: 15,
                repeat: 0
            });
            console.log('[Player] Created: attack');
        }

        // SPECIAL - 7 frames, NO REPEAT
        if (!anims.exists('special')) {
            anims.create({
                key: 'special',
                frames: [
                    { key: 'player_attack_1' },
                    { key: 'player_attack_2' },
                    { key: 'player_attack_3' },
                    { key: 'player_attack_4' },
                    { key: 'player_attack_5' },
                    { key: 'player_attack_4' },
                    { key: 'player_attack_3' }
                ],
                frameRate: 20,
                repeat: 0
            });
            console.log('[Player] Created: special');
        }

        // HURT - 1 frame
        if (!anims.exists('hurt')) {
            anims.create({
                key: 'hurt',
                frames: [{ key: 'player_dead' }],
                frameRate: 1,
                repeat: 0
            });
            console.log('[Player] Created: hurt');
        }

        // DEAD - 1 frame
        if (!anims.exists('dead')) {
            anims.create({
                key: 'dead',
                frames: [{ key: 'player_dead' }],
                frameRate: 1,
                repeat: 0
            });
            console.log('[Player] Created: dead');
        }

        // WIN - 1 frame
        if (!anims.exists('win')) {
            anims.create({
                key: 'win',
                frames: [{ key: 'player_win' }],
                frameRate: 1,
                repeat: 0
            });
            console.log('[Player] Created: win');
        }

        console.log('[Player] All animations created ✓');
    }

    changeAnimation(key) {
        // Don't change if locked
        if (this.animationState.locked) {
            return;
        }

        // Don't change if already playing - PREVENTS ANIMATION SPAM
        if (this.anims.currentAnim && this.anims.currentAnim.key === key) {
            return;
        }

        // Update state
        this.animationState.previous = this.animationState.current;
        this.animationState.current = key;

        // Play animation
        try {
            this.play(key, true);
            console.log(`[Player] Animation: ${this.animationState.previous} → ${key}`);
        } catch (e) {
            console.error(`[Player] Animation error: ${key}`, e);
        }
    }

    lockAnimation(duration) {
        this.animationState.locked = true;
        
        if (this.animationState.lockTimer) {
            this.animationState.lockTimer.remove();
        }

        this.animationState.lockTimer = this.scene.time.delayedCall(duration, () => {
            this.animationState.locked = false;
        });
    }

    playSound(key, config = {}) {
        if (this.scene.registry.get('sfxEnabled') !== false) {
            try {
                this.scene.sound.play(key, config);
            } catch (e) {
                console.warn('[Player] Sound error:', key);
            }
        }
    }

    update(cursors, keys) {
        // ===== PRIORITY 1: DEAD =====
        if (this.isDead) {
            return;
        }

        // ===== PRIORITY 2: HURT =====
        if (this.isHurt) {
            return;
        }

        // Ground detection
        const onGround = this.body.blocked.down || this.body.touching.down;

        // Update special cooldown
        if (this.specialCooldown > 0) {
            this.specialCooldown -= this.scene.game.loop.delta;
            if (this.specialCooldown < 0) this.specialCooldown = 0;
        }

        // ===== PRIORITY 3: ATTACKING =====
        if (this.isAttacking || this.isSpecialAttacking) {
            this.setVelocityX(this.body.velocity.x * 0.9);
            return;
        }

        // ===== MOVEMENT INPUT =====
        let isMoving = false;
        const maxSpeed = 300;
        const acceleration = 35;

        if (keys.A.isDown) {
            const newVelX = Math.max(this.body.velocity.x - acceleration, -maxSpeed);
            this.setVelocityX(newVelX);
            this.setFlipX(true);
            isMoving = true;
        } else if (keys.D.isDown) {
            const newVelX = Math.min(this.body.velocity.x + acceleration, maxSpeed);
            this.setVelocityX(newVelX);
            this.setFlipX(false);
            isMoving = true;
        } else {
            this.setVelocityX(this.body.velocity.x * 0.85);
        }

        // ===== JUMP INPUT =====
        if (Phaser.Input.Keyboard.JustDown(keys.SPACE) && onGround) {
            this.setVelocityY(-550);
            this.changeAnimation('jump');
            this.playSound('jump', { volume: 0.4 });
        }

        // ===== PRIORITY 4: ANIMATION STATE MACHINE =====
        if (!this.animationState.locked) {
            if (!onGround) {
                // IN AIR - play jump
                this.changeAnimation('jump');
            } else {
                // ON GROUND
                if (isMoving) {
                    // MOVING - play run
                    this.changeAnimation('run');
                } else {
                    // NOT MOVING - play idle
                    if (Math.abs(this.body.velocity.x) < 10) {
                        this.setVelocityX(0);
                        this.changeAnimation('idle');
                    }
                }
            }
        }

        // ===== ATTACK INPUT =====
        if (Phaser.Input.Keyboard.JustDown(keys.J) && !this.isAttacking && !this.isSpecialAttacking) {
            this.attack();
        }

        // ===== SPECIAL ATTACK INPUT =====
        if ((Phaser.Input.Keyboard.JustDown(keys.F) || Phaser.Input.Keyboard.JustDown(keys.K)) && !this.isAttacking && !this.isSpecialAttacking && this.specialCooldown <= 0) {
            this.specialAttack();
        }
    }

    attack() {
        this.isAttacking = true;
        this.changeAnimation('attack');
        this.lockAnimation(600);
        this.playSound('attack', { volume: 0.5 });

        const attackTimer = this.scene.time.delayedCall(600, () => {
            if (this.isAttacking) {
                this.isAttacking = false;
            }
        });

        this.once('animationcomplete', () => {
            if (this.isAttacking) {
                this.isAttacking = false;
                attackTimer.remove();
            }
        });

        this.scene.checkPlayerAttack(20);
    }

    specialAttack() {
        this.isSpecialAttacking = true;
        this.specialCooldown = this.specialCooldownTime;

        this.setTint(0xffaa00);
        this.changeAnimation('special');
        this.lockAnimation(700);
        this.playSound('attack', { volume: 0.7, rate: 0.8 });

        this.scene.cameras.main.shake(300, 0.015);

        const specialTimer = this.scene.time.delayedCall(700, () => {
            if (this.isSpecialAttacking) {
                this.isSpecialAttacking = false;
                this.clearTint();
            }
        });

        this.once('animationcomplete', () => {
            if (this.isSpecialAttacking) {
                this.isSpecialAttacking = false;
                this.clearTint();
                specialTimer.remove();
            }
        });

        this.scene.checkPlayerAttack(35, true);
    }

    getSpecialCooldownPercent() {
        return 1 - (this.specialCooldown / this.specialCooldownTime);
    }

    takeDamage(amount) {
        if (this.isDead || this.isHurt || this.isInvincible) return;

        this.hp -= amount;
        this.isHurt = true;
        this.isInvincible = true;

        this.changeAnimation('hurt');
        this.lockAnimation(400);
        this.setTint(0xff0000);

        // Screen effects
        this.scene.cameras.main.shake(200, 0.015);
        this.scene.cameras.main.flash(200, 255, 0, 0, false);

        this.playSound('hit', { volume: 0.5 });

        if (this.hp <= 0) {
            this.die();
        } else {
            // Knockback
            this.setVelocityX(this.flipX ? 150 : -150);

            // Recovery - NO TRANSPARENCY EFFECT
            this.scene.time.delayedCall(400, () => {
                this.isHurt = false;
                this.clearTint();
                this.alpha = 1; // ALWAYS KEEP FULLY VISIBLE

                this.scene.time.delayedCall(200, () => {
                    this.isInvincible = false;
                });
            });

            // NO FLICKER EFFECT - REMOVED COMPLETELY
            // Player stays fully visible at all times
        }
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.changeAnimation('dead');
        this.setTint(0x7a0010);

        this.scene.time.delayedCall(1200, () => {
            this.scene.showGameOver('defeat');
        });
    }
}
