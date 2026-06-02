/**
 * ELEMENTAL CLASH - Fighter Class
 * Reusable fighter system for all elemental characters
 * FIXED: Uses manifest-based frame loading, proper jump logic, increased scale
 */

export class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, characterKey, isPlayer1 = true) {
        super(scene, x, y, `${characterKey}_idle_1`);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Character identity
        this.characterKey = characterKey;
        this.isPlayer1 = isPlayer1;

        // Combat stats
        this.hp = 300;
        this.maxHp = 300;
        this.basicDamage = 20;
        this.specialDamage = 35;

        // State flags - PRIORITY ORDER
        this.isDead = false;
        this.isHurt = false;
        this.isDefending = false;
        this.isRolling = false;
        this.isSpecialAttacking = false;
        this.isAttacking = false;
        this.isAirAttacking = false;
        this.isInvincible = false;

        // Combo system
        this.comboCount = 0;
        this.comboTimer = 0;
        this.comboWindow = 800;

        // Cooldowns
        this.attackCooldown = 0;
        this.specialCooldown = 0;
        this.specialCooldownTime = 4000;
        this.rollCooldown = 0;
        this.rollCooldownTime = 1500;

        // Animation state
        this.currentAnimKey = 'idle';

        // Physics setup - PROPER SCALING AND ALIGNMENT
        this.setOrigin(0.5, 1);  // Bottom-center for ground alignment
        this.setScale(3.2);      // Increased scale for visibility
        this.characterScale = 3.2;
        this.body.setSize(60, 100);
        this.body.setOffset(114, 28);
        this.setCollideWorldBounds(true);
        this.alpha = 1;

        // Face opponent
        if (!isPlayer1) {
            this.setFlipX(true);
        }

        // Create animations
        this.createAnimations();
        this.playAnimation('idle');

        console.log(`[Fighter] ${characterKey} initialized at scale 3.2`);
    }

    createAnimations() {
        const anims = this.scene.anims;
        const key = this.characterKey;

        console.log(`[Fighter] Creating animations for ${key}...`);

        // Animation definitions with frame rates
        const animDefs = [
            { name: 'idle', frameRate: 8, repeat: -1 },
            { name: 'run', frameRate: 12, repeat: -1 },
            { name: 'jump', frameRate: 10, repeat: 0 },
            { name: 'jump_up', frameRate: 10, repeat: 0 },
            { name: 'jump_down', frameRate: 10, repeat: 0 },
            { name: 'roll', frameRate: 15, repeat: 0 },
            { name: 'attack_1', frameRate: 15, repeat: 0 },
            { name: 'attack_2', frameRate: 16, repeat: 0 },
            { name: 'attack_3', frameRate: 18, repeat: 0 },
            { name: 'special', frameRate: 18, repeat: 0 },
            { name: 'defend', frameRate: 8, repeat: -1 },
            { name: 'hurt', frameRate: 10, repeat: 0 },
            { name: 'death', frameRate: 8, repeat: 0 },
            { name: 'air_attack', frameRate: 16, repeat: 0 }
        ];

        animDefs.forEach(def => {
            const animKey = `${key}_${def.name}`;
            
            if (!anims.exists(animKey)) {
                // Get frames from textures (loaded by manifest)
                const frames = this.getFramesForAnimation(def.name);
                
                if (frames.length > 0) {
                    anims.create({
                        key: animKey,
                        frames: frames,
                        frameRate: def.frameRate,
                        repeat: def.repeat
                    });
                    console.log(`[Fighter] ✓ ${animKey} (${frames.length} frames @ ${def.frameRate}fps)`);
                } else {
                    console.warn(`[Fighter] ⚠ No frames for ${animKey}`);
                }
            }
        });
    }

    getFramesForAnimation(animName) {
        const key = this.characterKey;
        const frames = [];
        let frameIndex = 1;

        // Scan for frames: charKey_animName_1, charKey_animName_2, etc.
        while (true) {
            const frameKey = `${key}_${animName}_${frameIndex}`;
            
            if (this.scene.textures.exists(frameKey)) {
                frames.push({ key: frameKey });
                frameIndex++;
            } else {
                break;  // No more frames
            }
        }

        return frames;
    }

    playAnimation(animKey) {
        const fullKey = `${this.characterKey}_${animKey}`;
        
        // CRITICAL: Prevent animation restart spam
        if (this.anims.currentAnim && this.anims.currentAnim.key === fullKey) {
            return;  // Already playing
        }

        this.currentAnimKey = animKey;

        try {
            this.play(fullKey, true);
        } catch (e) {
            console.error(`[Fighter] Animation error: ${fullKey}`, e);
        }
    }

    update(controls) {
        // ===== PRIORITY 1: DEAD =====
        if (this.isDead) return;

        // ===== PRIORITY 2: HURT =====
        if (this.isHurt) return;

        // Ground detection - IMPROVED
        const onGround = this.body.blocked.down || this.body.touching.down;
        
        // DEBUG: Log ground state periodically (every 60 frames = ~1 second)
        if (!this.groundCheckCounter) this.groundCheckCounter = 0;
        this.groundCheckCounter++;
        if (this.groundCheckCounter >= 60) {
            console.log('[Fighter] Ground check:', {
                onGround: onGround,
                blocked: { down: this.body.blocked.down, up: this.body.blocked.up },
                touching: { down: this.body.touching.down },
                y: Math.round(this.y),
                velocityY: Math.round(this.body.velocity.y)
            });
            this.groundCheckCounter = 0;
        }

        // DEBUG: Log when controls are received
        if (controls.jump && !this.lastJumpLog) {
            console.log('[Fighter] Jump control received. onGround:', onGround, 'Y:', Math.round(this.y), 'VelY:', Math.round(this.body.velocity.y));
            this.lastJumpLog = true;
            setTimeout(() => this.lastJumpLog = false, 500);
        }
        if (controls.special && !this.lastSpecialLog) {
            console.log('[Fighter] Special control received. onGround:', onGround, 'cooldown:', this.specialCooldown);
            this.lastSpecialLog = true;
            setTimeout(() => this.lastSpecialLog = false, 500);
        }
        if (controls.defend && !this.lastDefendLog) {
            console.log('[Fighter] Defend control received. onGround:', onGround, 'isAttacking:', this.isAttacking);
            this.lastDefendLog = true;
            setTimeout(() => this.lastDefendLog = false, 500);
        }
        if (controls.roll && !this.lastRollLog) {
            console.log('[Fighter] Roll control received. onGround:', onGround, 'cooldown:', this.rollCooldown);
            this.lastRollLog = true;
            setTimeout(() => this.lastRollLog = false, 500);
        }

        // Update cooldowns
        if (this.attackCooldown > 0) this.attackCooldown -= this.scene.game.loop.delta;
        if (this.specialCooldown > 0) this.specialCooldown -= this.scene.game.loop.delta;
        if (this.rollCooldown > 0) this.rollCooldown -= this.scene.game.loop.delta;
        if (this.comboTimer > 0) {
            this.comboTimer -= this.scene.game.loop.delta;
            if (this.comboTimer <= 0) this.comboCount = 0;
        }

        // ===== PRIORITY 3: DEFENDING =====
        if (this.isDefending) {
            this.setVelocityX(this.body.velocity.x * 0.95);
            
            if (!controls.defend) {
                this.isDefending = false;
            }
            return;
        }

        // ===== PRIORITY 4: ROLLING =====
        if (this.isRolling) return;

        // ===== PRIORITY 5: SPECIAL ATTACKING =====
        if (this.isSpecialAttacking) {
            this.setVelocityX(this.body.velocity.x * 0.9);
            return;
        }

        // ===== PRIORITY 6: ATTACKING =====
        if (this.isAttacking) {
            this.setVelocityX(this.body.velocity.x * 0.9);
            return;
        }

        // ===== PRIORITY 7: AIR ATTACKING =====
        if (this.isAirAttacking) return;

        // ===== MOVEMENT INPUT =====
        let isMoving = false;
        const maxSpeed = 300;
        const acceleration = 35;

        if (controls.left) {
            const newVelX = Math.max(this.body.velocity.x - acceleration, -maxSpeed);
            this.setVelocityX(newVelX);
            this.setFlipX(true);
            isMoving = true;
        } else if (controls.right) {
            const newVelX = Math.min(this.body.velocity.x + acceleration, maxSpeed);
            this.setVelocityX(newVelX);
            this.setFlipX(false);
            isMoving = true;
        } else {
            this.setVelocityX(this.body.velocity.x * 0.85);
        }

        // ===== JUMP INPUT =====
        if (controls.jump && onGround) {
            console.log('[Fighter] ✓ EXECUTING JUMP!');
            this.setVelocityY(-450);
            this.playAnimation('jump_up');
            this.playSound('jump', { volume: 0.3 });
        }

        // ===== ROLL/DODGE INPUT =====
        if (controls.roll && onGround && this.rollCooldown <= 0) {
            console.log('[Fighter] ✓ EXECUTING ROLL!');
            this.roll();
        }

        // ===== DEFEND INPUT =====
        if (controls.defend && onGround && !this.isAttacking) {
            console.log('[Fighter] ✓ EXECUTING DEFEND!');
            this.defend();
        }

        // ===== ANIMATION STATE MACHINE =====
        // CRITICAL: Only update animation when NOT in locked state
        if (!this.isAttacking && !this.isSpecialAttacking && !this.isRolling && !this.isAirAttacking) {
            if (!onGround) {
                // IN AIR - FIXED JUMP LOGIC
                if (this.body.velocity.y < 0) {
                    this.playAnimation('jump_up');
                } else {
                    this.playAnimation('jump_down');
                }
            } else {
                // ON GROUND
                if (isMoving) {
                    this.playAnimation('run');
                } else {
                    if (Math.abs(this.body.velocity.x) < 10) {
                        this.setVelocityX(0);
                        this.playAnimation('idle');
                    }
                }
            }
        }

        // ===== ATTACK INPUT =====
        if (controls.attack && this.attackCooldown <= 0) {
            if (!onGround) {
                this.airAttack();
            } else {
                this.comboAttack();
            }
        }

        // ===== SPECIAL ATTACK INPUT =====
        if (controls.special && this.specialCooldown <= 0 && onGround) {
            console.log('[Fighter] ✓ EXECUTING SPECIAL ATTACK!');
            this.specialAttack();
        }
    }

    comboAttack() {
        this.isAttacking = true;
        this.comboCount++;
        this.comboTimer = this.comboWindow;
        
        let attackAnim = 'attack_1';
        let attackDuration = 400;
        let damage = this.basicDamage;
        
        if (this.comboCount === 2) {
            attackAnim = 'attack_2';
            attackDuration = 450;
            damage = this.basicDamage + 5;
        } else if (this.comboCount >= 3) {
            attackAnim = 'attack_3';
            attackDuration = 500;
            damage = this.basicDamage + 10;
            this.comboCount = 0;
        }
        
        this.attackCooldown = attackDuration;
        this.playAnimation(attackAnim);
        this.playSound('attack', { volume: 0.5 });

        const attackTimer = this.scene.time.delayedCall(attackDuration, () => {
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

        this.scene.checkAttack(this, damage, false);
    }

    airAttack() {
        this.isAirAttacking = true;
        this.attackCooldown = 500;
        this.playAnimation('air_attack');
        this.playSound('attack', { volume: 0.5, rate: 1.2 });

        const attackTimer = this.scene.time.delayedCall(450, () => {
            if (this.isAirAttacking) {
                this.isAirAttacking = false;
            }
        });

        this.once('animationcomplete', () => {
            if (this.isAirAttacking) {
                this.isAirAttacking = false;
                attackTimer.remove();
            }
        });

        this.scene.checkAttack(this, this.basicDamage + 5, false);
    }

    roll() {
        this.isRolling = true;
        this.isInvincible = true;
        this.rollCooldown = this.rollCooldownTime;
        
        this.playAnimation('roll');
        this.playSound('jump', { volume: 0.4, rate: 1.5 });

        const rollSpeed = this.flipX ? -400 : 400;
        this.setVelocityX(rollSpeed);

        this.scene.time.delayedCall(400, () => {
            this.isRolling = false;
            this.isInvincible = false;
        });

        this.once('animationcomplete', () => {
            if (this.isRolling) {
                this.isRolling = false;
                this.isInvincible = false;
            }
        });
    }

    defend() {
        this.isDefending = true;
        this.playAnimation('defend');
        this.setVelocityX(0);
    }

    specialAttack() {
        // FIXED: Use attack_3 animation for special attack (07_3_atk folder)
        this.isSpecialAttacking = true;
        this.specialCooldown = this.specialCooldownTime;
        this.playAnimation('attack_3');  // Uses 07_3_atk animation
        this.playSound('attack', { volume: 0.7, rate: 0.8 });

        this.setTint(0xffaa00);
        this.scene.cameras.main.shake(250, 0.012);

        // Longer duration for attack_3 animation (26-28 frames)
        const specialTimer = this.scene.time.delayedCall(800, () => {
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

        this.scene.checkAttack(this, this.specialDamage, true);
    }

    takeDamage(amount) {
        if (this.isDead || this.isHurt || this.isInvincible) return;

        if (this.isDefending) {
            amount = Math.floor(amount * 0.3);
            this.playSound('hit', { volume: 0.3, rate: 1.5 });
            this.scene.showDamageText(this.x, this.y - 80, 'BLOCKED!', '#00ffff');
            this.setVelocityX(this.flipX ? 50 : -50);
            return;
        }

        this.hp -= amount;
        this.isHurt = true;
        this.isInvincible = true;
        this.isDefending = false;

        this.playAnimation('hurt');
        this.setTint(0xff0000);
        this.alpha = 1;  // NO TRANSPARENCY FLICKER

        this.scene.cameras.main.shake(180, 0.012);
        this.scene.cameras.main.flash(180, 255, 0, 0, false);
        this.playSound('hurt', { volume: 0.5 });

        if (this.hp <= 0) {
            this.die();
        } else {
            this.setVelocityX(this.flipX ? 150 : -150);

            this.scene.time.delayedCall(350, () => {
                this.isHurt = false;
                this.clearTint();
                this.alpha = 1;

                this.scene.time.delayedCall(150, () => {
                    this.isInvincible = false;
                });
            });
        }
    }

    die() {
        this.isDead = true;
        this.setVelocity(0);
        this.playAnimation('death');
        this.setTint(0x666666);
        this.playSound('dead', { volume: 0.6 });

        this.scene.time.delayedCall(1500, () => {
            this.scene.endMatch(this.isPlayer1 ? 'player2' : 'player1');
        });
    }

    playSound(soundName, config = {}) {
        if (this.scene.registry.get('sfxEnabled') !== false) {
            try {
                const charSpecificKey = `${this.characterKey}_${soundName}`;
                if (this.scene.cache.audio.exists(charSpecificKey)) {
                    this.scene.sound.play(charSpecificKey, config);
                } else {
                    let fallbackKey = soundName;
                    if (soundName === 'hurt') {
                        fallbackKey = 'hit';
                    }
                    this.scene.sound.play(fallbackKey, config);
                }
            } catch (e) {
                console.warn('[Fighter] Sound error:', soundName, e);
            }
        }
    }

    getSpecialCooldownPercent() {
        return 1 - (this.specialCooldown / this.specialCooldownTime);
    }
}
