class BattleScene extends Phaser.Scene {

    constructor() {
        super("BattleScene");
    }

    preload() {

        // ====================
        // IDLE
        // ====================

        this.load.image("idle_1", "assets/characters/Blaze/idle_1_Fire.png");
        this.load.image("idle_2", "assets/characters/Blaze/idle_2_Fire.png");
        this.load.image("idle_3", "assets/characters/Blaze/idle_3_Fire.png");
        this.load.image("idle_4", "assets/characters/Blaze/idle_4_Fire.png");

        // ====================
        // RUN
        // ====================

        this.load.image("run_1", "assets/characters/Blaze/run_1_Fire.png");
        this.load.image("run_2", "assets/characters/Blaze/run_2_Fire.png");
        this.load.image("run_3", "assets/characters/Blaze/run_3_Fire.png");
        this.load.image("run_4", "assets/characters/Blaze/run_4_Fire.png");
        this.load.image("run_5", "assets/characters/Blaze/run_5_Fire.png");
        this.load.image("run_6", "assets/characters/Blaze/run_6_Fire.png");

        // ====================
        // ATTACK
        // ====================

        this.load.image("attack_1", "assets/characters/Blaze/attack_1_Fire.png");
        this.load.image("attack_2", "assets/characters/Blaze/attack_2_Fire.png");
        this.load.image("attack_3", "assets/characters/Blaze/attack_3_Fire.png");
        this.load.image("attack_4", "assets/characters/Blaze/attack_4_Fire.png");

        // ====================
        // HURT
        // ====================

        this.load.image("hurt_1", "assets/characters/Blaze/hurt_1_Fire.png");
        this.load.image("hurt_2", "assets/characters/Blaze/hurt_2_Fire.png");

        // ====================
        // JUMP
        // ====================

        this.load.image("jump_1", "assets/characters/Blaze/jump_1_Fire.png");

        // ====================
        // SOUND
        // ====================

        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("dash", "assets/sounds/dash.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("special", "assets/sounds/special.mp3");

    }

    create() {

        // CAMERA
        this.cameras.main.setZoom(1.2);

        // BACKGROUND
        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x1e293b
        );

        // ====================
        // SHADOW
        // ====================

        this.playerShadow = this.add.ellipse(
            200,
            620,
            80,
            20,
            0x000000,
            0.4
        );

        this.enemyShadow = this.add.ellipse(
            1000,
            620,
            80,
            20,
            0x000000,
            0.4
        );

        // ====================
        // UI
        // ====================

        this.playerHPBar = this.add.rectangle(
            250,
            50,
            300,
            30,
            0x00ff00
        );

        this.enemyHPBar = this.add.rectangle(
            1030,
            50,
            300,
            30,
            0x00ff00
        );

        this.energyBar = this.add.rectangle(
            250,
            90,
            300,
            20,
            0x00ffff
        );

        this.timerText = this.add.text(
            610,
            35,
            "60",
            {
                fontSize: "32px",
                color: "#ffffff"
            }
        );

        // ====================
        // GROUND
        // ====================

        this.ground = this.add.rectangle(
            640,
            680,
            1280,
            80,
            0x444444
        );

        this.physics.add.existing(
            this.ground,
            true
        );

        // ====================
        // PLAYER
        // ====================

        this.player = this.physics.add.sprite(
            200,
            500,
            "idle_1"
        );

        this.player.setScale(4);

        this.player.setCollideWorldBounds(true);

        // ====================
        // ENEMY
        // ====================

        this.enemy = this.physics.add.sprite(
            1000,
            500,
            "idle_1"
        );

        this.enemy.setScale(4);

        this.enemy.setFlipX(true);

        this.enemy.setCollideWorldBounds(true);

        // ====================
        // COLLISION
        // ====================

        this.physics.add.collider(
            this.player,
            this.ground
        );

        this.physics.add.collider(
            this.enemy,
            this.ground
        );

        // ====================
        // KEYBOARD
        // ====================

        this.keys = this.input.keyboard.addKeys({
            left: "A",
            right: "D",
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            skill: Phaser.Input.Keyboard.KeyCodes.F
        });

        // ====================
        // DOUBLE JUMP
        // ====================

        this.jumpCount = 0;

        // ====================
        // DASH
        // ====================

        this.lastLeftPress = 0;
        this.lastRightPress = 0;

        // ====================
        // GAMEPAD
        // ====================

        this.pad = null;

        this.input.gamepad.once(
            "connected",
            (pad) => {

                this.pad = pad;

                console.log(
                    "Gamepad Connected"
                );

            }
        );

        // ====================
        // HP
        // ====================

        this.playerHP = 100;
        this.enemyHP = 100;

        // ====================
        // ENERGY
        // ====================

        this.playerEnergy = 100;
        this.maxEnergy = 100;

        // ====================
        // COMBAT
        // ====================

        this.isAttacking = false;
        this.canAttack = true;

        // ====================
        // TIMER
        // ====================

        this.timeLeft = 60;

        // ====================
        // ANIMATION
        // ====================

        this.currentAnimation = "idle";
        this.currentFrame = 0;

        this.idleFrames = [
            "idle_1",
            "idle_2",
            "idle_3",
            "idle_4"
        ];

        this.runFrames = [
            "run_1",
            "run_2",
            "run_3",
            "run_4",
            "run_5",
            "run_6"
        ];

        // ====================
        // ANIMATION EVENT
        // ====================

        this.time.addEvent({

            delay: 120,

            callback: () => {

                // JANGAN TIMPA ATTACK
                if (
                    this.currentAnimation === "attack"
                ) {

                    return;

                }

                // IDLE
                if (
                    this.currentAnimation === "idle"
                ) {

                    this.currentFrame++;

                    if (
                        this.currentFrame >=
                        this.idleFrames.length
                    ) {

                        this.currentFrame = 0;

                    }

                    this.player.setTexture(
                        this.idleFrames[
                            this.currentFrame
                        ]
                    );

                }

                // RUN
                if (
                    this.currentAnimation === "run"
                ) {

                    this.currentFrame++;

                    if (
                        this.currentFrame >=
                        this.runFrames.length
                    ) {

                        this.currentFrame = 0;

                    }

                    this.player.setTexture(
                        this.runFrames[
                            this.currentFrame
                        ]
                    );

                }

            },

            loop: true

        });

        // ====================
        // TIMER EVENT
        // ====================

        this.time.addEvent({

            delay: 1000,

            callback: () => {

                this.timeLeft--;

                this.timerText.setText(
                    this.timeLeft
                );

            },

            loop: true

        });

        // ====================
        // SPECIAL EFFECT
        // ====================

        this.skillEffect = this.add.circle(
            this.player.x,
            this.player.y,
            50,
            0x00ffff
        );

        this.skillEffect.setVisible(false);

        // ====================
        // HIT EFFECT
        // ====================

        this.hitEffect = this.add.circle(
            0,
            0,
            30,
            0xffffff
        );

        this.hitEffect.setVisible(false);

        // ====================
        // BASIC ATTACK
        // ====================

        this.input.on("pointerdown", () => {

            // COOLDOWN
            if (!this.canAttack) {

                return;

            }

            // ATTACK LOCK
            if (this.isAttacking) {

                return;

            }

            this.canAttack = false;

            this.isAttacking = true;

            this.currentAnimation = "attack";

            // ATTACK FRAME 1
            this.player.setTexture(
                "attack_1"
            );

            this.time.delayedCall(80, () => {

                this.player.setTexture(
                    "attack_2"
                );

            });

            this.time.delayedCall(160, () => {

                this.player.setTexture(
                    "attack_3"
                );

            });

            this.time.delayedCall(240, () => {

                this.player.setTexture(
                    "attack_4"
                );

            });

            // RETURN IDLE
            this.time.delayedCall(320, () => {

                this.currentAnimation =
                    "idle";

                this.isAttacking = false;

            });

            // DISTANCE
            let distance =
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.enemy.x,
                    this.enemy.y
                );

            // MUSUH KENA
            if (distance < 150) {

                this.enemyHP -= 10;

                this.sound.play("hit");

                // CAMERA SHAKE
                this.cameras.main.shake(
                    120,
                    0.015
                );

                // HIT STOP
                this.physics.pause();

                this.time.delayedCall(
                    60,
                    () => {

                        this.physics.resume();

                    }
                );

                // HIT EFFECT
                this.hitEffect.setVisible(
                    true
                );

                this.hitEffect.x =
                    this.enemy.x;

                this.hitEffect.y =
                    this.enemy.y;

                this.hitEffect.setScale(1);

                this.hitEffect.alpha = 1;

                this.tweens.add({

                    targets:
                        this.hitEffect,

                    scale: 2,

                    alpha: 0,

                    duration: 120,

                    onComplete: () => {

                        this.hitEffect.setVisible(
                            false
                        );

                    }

                });

                // FLASH
                this.enemy.setTint(
                    0xffffff
                );

                this.time.delayedCall(
                    100,
                    () => {

                        this.enemy.clearTint();

                    }
                );

                // ATTACK SCALE
                this.player.setScale(4.3);

                this.time.delayedCall(
                    100,
                    () => {

                        this.player.setScale(
                            4
                        );

                    }
                );

                // KNOCKBACK
                if (
                    this.enemy.x >
                    this.player.x
                ) {

                    this.enemy.setVelocityX(
                        500
                    );

                }
                else {

                    this.enemy.setVelocityX(
                        -500
                    );

                }

                // HURT
                this.enemy.setTexture(
                    "hurt_1"
                );

                this.time.delayedCall(
                    100,
                    () => {

                        this.enemy.setTexture(
                            "hurt_2"
                        );

                    }
                );

                this.time.delayedCall(
                    200,
                    () => {

                        this.enemy.setTexture(
                            "idle_1"
                        );

                    }
                );

            }

            // RESET COOLDOWN
            this.time.delayedCall(
                400,
                () => {

                    this.canAttack = true;

                }
            );

        });

    }

    update() {

        // JANGAN GERAK SAAT ATTACK
        if (this.isAttacking) {

            return;

        }

        // RESET MOVEMENT
        this.player.setVelocityX(0);

        // SHADOW FOLLOW
        this.playerShadow.x =
            this.player.x;

        this.enemyShadow.x =
            this.enemy.x;

        // ====================
        // MOVE LEFT
        // ====================

        if (this.keys.left.isDown) {

            this.player.setVelocityX(
                -250
            );

            this.player.setFlipX(true);

            this.currentAnimation = "run";

        }

        // ====================
        // MOVE RIGHT
        // ====================

        else if (
            this.keys.right.isDown
        ) {

            this.player.setVelocityX(
                250
            );

            this.player.setFlipX(false);

            this.currentAnimation = "run";

        }

        // ====================
        // IDLE
        // ====================

        else {

            this.currentAnimation = "idle";

        }

        // ====================
        // DOUBLE JUMP
        // ====================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.jump
            )
        ) {

            if (this.jumpCount < 2) {

                this.player.setVelocityY(
                    -450
                );

                this.player.setTexture(
                    "jump_1"
                );

                this.sound.play("jump");

                this.jumpCount++;

            }

        }

        // RESET JUMP
        if (
            this.player.body.touching.down
        ) {

            this.jumpCount = 0;

        }

        // ====================
        // DASH LEFT
        // ====================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.left
            )
        ) {

            let time = this.time.now;

            if (
                time -
                    this.lastLeftPress <
                300
            ) {

                this.player.setVelocityX(
                    -500
                );

                this.sound.play(
                    "dash"
                );

            }

            this.lastLeftPress = time;

        }

        // ====================
        // DASH RIGHT
        // ====================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.right
            )
        ) {

            let time = this.time.now;

            if (
                time -
                    this.lastRightPress <
                300
            ) {

                this.player.setVelocityX(
                    500
                );

                this.sound.play(
                    "dash"
                );

            }

            this.lastRightPress = time;

        }

        // ====================
        // GAMEPAD
        // ====================

        if (this.pad) {

            let axisX =
                this.pad.axes[0].getValue();

            if (axisX < -0.1) {

                this.player.setVelocityX(
                    -250
                );

                this.player.setFlipX(true);

                this.currentAnimation =
                    "run";

            }
            else if (axisX > 0.1) {

                this.player.setVelocityX(
                    250
                );

                this.player.setFlipX(false);

                this.currentAnimation =
                    "run";

            }

        }

        // ====================
        // ENEMY FACE PLAYER
        // ====================

        if (
            this.enemy.x >
            this.player.x
        ) {

            this.enemy.setFlipX(true);

        }
        else {

            this.enemy.setFlipX(false);

        }

        // ====================
        // AI MOVEMENT
        // ====================

        if (
            this.enemy.x >
            this.player.x + 50
        ) {

            this.enemy.setVelocityX(
                -150
            );

        }
        else if (
            this.enemy.x <
            this.player.x - 50
        ) {

            this.enemy.setVelocityX(
                150
            );

        }
        else {

            this.enemy.setVelocityX(0);

        }

        // ====================
        // AI ATTACK
        // ====================

        let enemyDistance =
            Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.enemy.x,
                this.enemy.y
            );

        if (enemyDistance < 120) {

            this.playerHP -= 0.1;

        }

        // ====================
        // SPECIAL SKILL
        // ====================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.skill
            )
        ) {

            if (
                this.playerEnergy >= 30
            ) {

                this.playerEnergy -= 30;

                this.sound.play(
                    "special"
                );

                // EFFECT
                this.skillEffect.setVisible(
                    true
                );

                this.skillEffect.x =
                    this.player.x;

                this.skillEffect.y =
                    this.player.y;

                this.skillEffect.fillColor =
                    0xff6600;

                this.time.delayedCall(
                    200,
                    () => {

                        this.skillEffect.setVisible(
                            false
                        );

                    }
                );

                // SCALE
                this.player.setScale(4.5);

                this.time.delayedCall(
                    150,
                    () => {

                        this.player.setScale(
                            4
                        );

                    }
                );

                // SHAKE
                this.cameras.main.shake(
                    200,
                    0.02
                );

                // DAMAGE
                let distance =
                    Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        this.enemy.x,
                        this.enemy.y
                    );

                if (distance < 250) {

                    this.enemyHP -= 25;

                    if (
                        this.enemy.x >
                        this.player.x
                    ) {

                        this.enemy.setVelocityX(
                            700
                        );

                    }
                    else {

                        this.enemy.setVelocityX(
                            -700
                        );

                    }

                }

            }

        }

        // ====================
        // ENERGY REGEN
        // ====================

        this.playerEnergy += 0.2;

        // ====================
        // UPDATE UI
        // ====================

        this.playerHPBar.width =
            this.playerHP * 3;

        this.enemyHPBar.width =
            this.enemyHP * 3;

        this.energyBar.width =
            this.playerEnergy * 3;

        // ====================
        // CLAMP
        // ====================

        this.playerHP =
            Phaser.Math.Clamp(
                this.playerHP,
                0,
                100
            );

        this.enemyHP =
            Phaser.Math.Clamp(
                this.enemyHP,
                0,
                100
            );

        this.playerEnergy =
            Phaser.Math.Clamp(
                this.playerEnergy,
                0,
                this.maxEnergy
            );

        // ====================
        // GAME OVER
        // ====================

        if (this.playerHP <= 0) {

            this.scene.restart();

        }

        if (this.enemyHP <= 0) {

            this.scene.restart();

        }

        if (this.timeLeft <= 0) {

            this.scene.restart();

        }

    }

}