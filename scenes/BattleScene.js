class BattleScene extends Phaser.Scene {

    constructor() {
        super("BattleScene");
    }

    preload() {

        // ====================
        // CHARACTER BLAZE
        // ====================

        // IDLE
        this.load.image("idle_1", "assets/characters/Blaze/idle_1_Fire.png");
        this.load.image("idle_2", "assets/characters/Blaze/idle_2_Fire.png");
        this.load.image("idle_3", "assets/characters/Blaze/idle_3_Fire.png");
        this.load.image("idle_4", "assets/characters/Blaze/idle_4_Fire.png");

        // RUN
        this.load.image("run_1", "assets/characters/Blaze/run_1_Fire.png");
        this.load.image("run_2", "assets/characters/Blaze/run_2_Fire.png");
        this.load.image("run_3", "assets/characters/Blaze/run_3_Fire.png");
        this.load.image("run_4", "assets/characters/Blaze/run_4_Fire.png");
        this.load.image("run_5", "assets/characters/Blaze/run_5_Fire.png");
        this.load.image("run_6", "assets/characters/Blaze/run_6_Fire.png");

        // ATTACK
        this.load.image("attack_1", "assets/characters/Blaze/attack_1_Fire.png");
        this.load.image("attack_2", "assets/characters/Blaze/attack_2_Fire.png");
        this.load.image("attack_3", "assets/characters/Blaze/attack_3_Fire.png");
        this.load.image("attack_4", "assets/characters/Blaze/attack_4_Fire.png");

        // HURT
        this.load.image("hurt_1", "assets/characters/Blaze/hurt_1_Fire.png");
        this.load.image("hurt_2", "assets/characters/Blaze/hurt_2_Fire.png");

        // JUMP
        this.load.image("jump_1", "assets/characters/Blaze/jump_1_Fire.png");

        // ====================
        // SOUND
        // ====================

        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("dash", "assets/sounds/dash.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("special", "assets/sounds/special.mp3");

        // ====================
        // MAP
        // ====================

        this.load.image(
            "arena_fire",
            "assets/backgrounds/arena_fire.png"
        );

        this.load.image(
            "arena_ice",
            "assets/backgrounds/arena_ice.png"
        );

        this.load.image(
            "arena_volt",
            "assets/backgrounds/arena_volt.png"
        );

        this.load.image(
            "arena_nusantara",
            "assets/backgrounds/arena_nusantara.png"
        );

        // ====================
        // MUSIC
        // ====================

        this.load.audio(
            "battle_music",
            "assets/sounds/battle_music.mp3"
        );

    }

    create() {

        // ====================
        // CHARACTER SELECT
        // ====================

        this.selectedCharacter =
            localStorage.getItem(
                "selectedCharacter"
            ) || "Blaze";

        // ====================
        // CHARACTER DATA
        // ====================

        this.characterData = {

            Blaze: {
                color: 0xff6600,
                damage: 25,
                map: "arena_fire"
            },

            Frost: {
                color: 0x66ccff,
                damage: 20,
                map: "arena_ice"
            },

            Volt: {
                color: 0xffff00,
                damage: 18,
                map: "arena_volt"
            },

            Arka: {
                color: 0x66ff99,
                damage: 22,
                map: "arena_nusantara"
            }

        };

        this.activeCharacter =
            this.characterData[
                this.selectedCharacter
            ];

        // ====================
        // CAMERA
        // ====================

        this.cameras.main.setZoom(1.2);

        // ====================
        // BACKGROUND
        // ====================

        this.selectedMap =
            this.activeCharacter.map;

        this.background = this.add.image(
            640,
            360,
            this.selectedMap
        );

        this.background.setDisplaySize(
            1280,
            720
        );

        // ====================
        // PARALLAX
        // ====================

        this.background.setScrollFactor(0.2);

        // ====================
        // MAP OVERLAY
        // ====================

        this.mapOverlay = this.add.rectangle(
            640,
            360,
            1280,
            720,
            this.activeCharacter.color,
            0.08
        );

        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x000000,
            0.15
        );

        // ====================
        // MAP NAME
        // ====================

        this.mapText = this.add.text(
            20,
            20,
            this.selectedMap
                .replace("arena_", "")
                .toUpperCase(),
            {
                fontSize: "24px",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: {
                    x: 10,
                    y: 5
                }
            }
        );

        // ====================
        // MUSIC
        // ====================

        this.bgm = this.sound.add(
            "battle_music",
            {
                volume: 0.5,
                loop: true
            }
        );

        this.bgm.play();

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

        this.playerHPBarBG = this.add.rectangle(
            250,
            50,
            300,
            30,
            0x222222
        );

        this.enemyHPBarBG = this.add.rectangle(
            1030,
            50,
            300,
            30,
            0x222222
        );

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

        this.energyBarBG = this.add.rectangle(
            250,
            90,
            300,
            20,
            0x222222
        );

        this.energyBar = this.add.rectangle(
            250,
            90,
            300,
            20,
            this.activeCharacter.color
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
        // ROUND TEXT
        // ====================

        this.roundText = this.add.text(
            560,
            80,
            "ROUND 1",
            {
                fontSize: "28px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // ====================
        // WINNER TEXT
        // ====================

        this.winnerText = this.add.text(
            410,
            300,
            "",
            {
                fontSize: "60px",
                color: "#ffff00",
                fontStyle: "bold",
                stroke: "#000000",
                strokeThickness: 8
            }
        );

        this.winnerText.setVisible(false);

        // ====================
        // GROUND
        // ====================

        this.ground = this.add.rectangle(
            640,
            680,
            1280,
            80,
            0x000000,
            0
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
        // PLAYER AURA
        // ====================

        this.playerAura = this.add.circle(
            this.player.x,
            this.player.y,
            60,
            this.activeCharacter.color,
            0.15
        );

        this.playerAura.setBlendMode(
            Phaser.BlendModes.ADD
        );

        this.enemyAura = this.add.circle(
            this.enemy.x,
            this.enemy.y,
            60,
            0xff0000,
            0.08
        );

        this.enemyAura.setBlendMode(
            Phaser.BlendModes.ADD
        );

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
            skill: Phaser.Input.Keyboard.KeyCodes.F,
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        // ====================
        // STATS
        // ====================

        this.jumpCount = 0;

        this.lastLeftPress = 0;
        this.lastRightPress = 0;

        this.playerHP = 100;
        this.enemyHP = 100;

        this.playerEnergy = 100;
        this.maxEnergy = 100;

        this.timeLeft = 60;

        // ====================
        // COMBAT
        // ====================

        this.isAttacking = false;
        this.canAttack = true;

        this.gameEnded = false;

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
        // ANIMATION DATA
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

                if (
                    this.currentAnimation === "attack"
                ) {
                    return;
                }

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

                if (this.gameEnded) {
                    return;
                }

                this.timeLeft--;

                this.timerText.setText(
                    this.timeLeft
                );

            },

            loop: true

        });

        // ====================
        // EFFECT
        // ====================

        this.skillEffect = this.add.circle(
            this.player.x,
            this.player.y,
            50,
            this.activeCharacter.color
        );

        this.skillEffect.setVisible(false);

        this.hitEffect = this.add.circle(
            0,
            0,
            30,
            0xffffff
        );

        this.hitEffect.setVisible(false);

        // ====================
        // ATTACK INPUT
        // ====================

        this.input.on("pointerdown", () => {

            if (!this.canAttack) {
                return;
            }

            if (this.isAttacking) {
                return;
            }

            if (this.gameEnded) {
                return;
            }

            this.canAttack = false;
            this.isAttacking = true;

            this.currentAnimation = "attack";

            this.player.setTexture(
                "attack_1"
            );

            this.time.delayedCall(80, () => {
                this.player.setTexture("attack_2");
            });

            this.time.delayedCall(160, () => {
                this.player.setTexture("attack_3");
            });

            this.time.delayedCall(240, () => {
                this.player.setTexture("attack_4");
            });

            this.time.delayedCall(320, () => {

                this.currentAnimation =
                    "idle";

                this.isAttacking = false;

            });

            let distance =
                Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.enemy.x,
                    this.enemy.y
                );

            if (distance < 150) {

                this.enemyHP -= 10;

                this.sound.play("hit");

                this.cameras.main.shake(
                    120,
                    0.015
                );

                // HIT EFFECT
                this.hitEffect.setVisible(
                    true
                );

                this.hitEffect.x =
                    this.enemy.x;

                this.hitEffect.y =
                    this.enemy.y;

                this.hitEffect.alpha = 1;

                this.hitEffect.scale = 1;

                this.tweens.add({

                    targets: this.hitEffect,

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
                this.enemy.setTint(0xffffff);

                this.time.delayedCall(
                    100,
                    () => {

                        this.enemy.clearTint();

                    }
                );

                // SCALE EFFECT
                this.player.setScale(4.3);

                this.time.delayedCall(
                    100,
                    () => {

                        this.player.setScale(4);

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

            }

            this.time.delayedCall(
                400,
                () => {

                    this.canAttack = true;

                }
            );

        });

    }

    update() {

        // ====================
        // STOP IF GAME END
        // ====================

        if (this.gameEnded) {
            return;
        }

        // ====================
        // PAUSE GAME
        // ====================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.pause
            )
        ) {

            if (this.physics.world.isPaused) {

                this.physics.resume();

            }
            else {

                this.physics.pause();

            }

        }

        if (this.isAttacking) {
            return;
        }

        // ====================
        // RESET
        // ====================

        this.player.setVelocityX(0);

        // ====================
        // CAMERA FOLLOW
        // ====================

        this.cameras.main.scrollX =
            (this.player.x - 640) * 0.03;

        // ====================
        // SHADOW FOLLOW
        // ====================

        this.playerShadow.x =
            this.player.x;

        this.enemyShadow.x =
            this.enemy.x;

        // ====================
        // AURA FOLLOW
        // ====================

        this.playerAura.x =
            this.player.x;

        this.playerAura.y =
            this.player.y;

        this.enemyAura.x =
            this.enemy.x;

        this.enemyAura.y =
            this.enemy.y;

        // ====================
        // AURA PULSE
        // ====================

        this.playerAura.scale += 0.002;

        if (
            this.playerAura.scale > 1.1
        ) {

            this.playerAura.scale = 1;

        }

        // ====================
        // MOVE
        // ====================

        if (this.keys.left.isDown) {

            this.player.setVelocityX(-250);

            this.player.setFlipX(true);

            this.currentAnimation = "run";

        }
        else if (this.keys.right.isDown) {

            this.player.setVelocityX(250);

            this.player.setFlipX(false);

            this.currentAnimation = "run";

        }
        else {

            this.currentAnimation = "idle";

        }

        // ====================
        // JUMP
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

                this.sound.play("dash");

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

                this.sound.play("dash");

            }

            this.lastRightPress = time;

        }

        // ====================
        // ENEMY AI
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

        if (
            this.enemy.x >
            this.player.x + 50
        ) {

            this.enemy.setVelocityX(-150);

        }
        else if (
            this.enemy.x <
            this.player.x - 50
        ) {

            this.enemy.setVelocityX(150);

        }
        else {

            this.enemy.setVelocityX(0);

        }

        // ====================
        // ENEMY ATTACK
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

                this.sound.play("special");

                this.skillEffect.setVisible(
                    true
                );

                this.skillEffect.x =
                    this.player.x;

                this.skillEffect.y =
                    this.player.y;

                // AURA BURST
                this.playerAura.setScale(2);

                this.playerAura.alpha = 0.4;

                this.tweens.add({

                    targets: this.playerAura,

                    scale: 1,

                    alpha: 0.15,

                    duration: 300

                });

                this.time.delayedCall(
                    200,
                    () => {

                        this.skillEffect.setVisible(
                            false
                        );

                    }
                );

                this.cameras.main.shake(
                    200,
                    0.02
                );

                let distance =
                    Phaser.Math.Distance.Between(
                        this.player.x,
                        this.player.y,
                        this.enemy.x,
                        this.enemy.y
                    );

                if (distance < 250) {

                    this.enemyHP -=
                        this.activeCharacter.damage;

                    this.enemy.setTint(
                        this.activeCharacter.color
                    );

                    this.time.delayedCall(
                        200,
                        () => {

                            this.enemy.clearTint();

                        }
                    );

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
        // UI UPDATE
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

            this.gameEnded = true;

            this.winnerText.setText(
                "ENEMY WINS"
            );

            this.winnerText.setVisible(true);

            this.physics.pause();

            this.time.delayedCall(
                3000,
                () => {

                    this.bgm.stop();

                    this.scene.restart();

                }
            );

        }

        if (this.enemyHP <= 0) {

            this.gameEnded = true;

            this.winnerText.setText(
                "PLAYER WINS"
            );

            this.winnerText.setVisible(true);

            this.physics.pause();

            this.time.delayedCall(
                3000,
                () => {

                    this.bgm.stop();

                    this.scene.restart();

                }
            );

        }

        if (this.timeLeft <= 0) {

            this.gameEnded = true;

            this.winnerText.setText(
                "TIME OVER"
            );

            this.winnerText.setVisible(true);

            this.physics.pause();

            this.time.delayedCall(
                3000,
                () => {

                    this.bgm.stop();

                    this.scene.restart();

                }
            );

        }

    }

}