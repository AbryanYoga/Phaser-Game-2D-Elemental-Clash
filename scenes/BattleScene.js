class BattleScene extends Phaser.Scene {

    constructor() {

        super("BattleScene");

    }

    preload() {

        // =========================
        // PLAYER SPRITES
        // =========================

        // BLAZE
        this.load.image(
            "Blaze_idle",
            "assets/characters/Blaze/idle_1_Fire.png"
        );

        // FROST
        this.load.image(
            "Frost_idle",
            "assets/characters/Frost/idle_1_Ice.png"
        );

        // VOLT
        this.load.image(
            "Volt_idle",
            "assets/characters/Volt/idle_1_Volt.png"
        );

        // ARKA
        this.load.image(
            "Arka_idle",
            "assets/characters/Arka/idle_1_Arka.png"
        );

        // =========================
        // MAP
        // =========================

        this.load.image(
            "arena_fire",
            "assets/backgrounds/arena_fire.png"
        );

    }

    create() {

        // =========================
        // GET DATA
        // =========================

        this.selectedCharacter =
            localStorage.getItem(
                "selectedCharacter"
            ) || "Blaze";

        this.selectedEnemy =
            localStorage.getItem(
                "selectedEnemy"
            ) || "Frost";

        this.selectedMap =
            localStorage.getItem(
                "selectedMap"
            ) || "arena_fire";

        this.bg = this.add.tittleSprite(
            2000,
            360,
            4000,
            720,
            this.selectedMap
        );

        // =========================
        // WORLD
        // =========================

        this.physics.world.setBounds(
            0,
            0,
            1280,
            720
        );

        // =========================
        // BACKGROUND
        // =========================

        this.bg = this.add.image(
            640,
            360,
            this.selectedMap
        );

        this.bg.setDisplaySize(
            1280,
            720
        );

        // DARK OVERLAY
        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x000000,
            0.15
        );

        // =========================
        // GROUND
        // =========================

        this.ground = this.add.rectangle(
            640,
            650,
            1280,
            80,
            0xffffff,
            0
        );

        this.physics.add.existing(
            this.ground,
            true
        );

        // =========================
        // PLAYER
        // =========================

        this.player = this.physics.add.sprite(
            300,
            500,
            this.selectedCharacter + "_idle"
        );

        this.player.setScale(6);

        this.player.setCollideWorldBounds(
            true
        );

        // =========================
        // ENEMY
        // =========================

        this.enemy = this.physics.add.sprite(
            980,
            500,
            this.selectedEnemy + "_idle"
        );

        this.enemy.setScale(6);

        this.enemy.setFlipX(true);

        this.enemy.setCollideWorldBounds(
            true
        );

        // =========================
        // COLLIDER
        // =========================

        this.physics.add.collider(
            this.player,
            this.ground
        );

        this.physics.add.collider(
            this.enemy,
            this.ground
        );

        // =========================
        // CAMERA
        // =========================

        this.cameras.main.setBounds(
            0,
            0,
            1280,
            720
        );

        // =========================
        // HP
        // =========================

        this.playerHP = 100;
        this.enemyHP = 100;

        // =========================
        // PLAYER HP BG
        // =========================

        this.add.rectangle(
            220,
            40,
            304,
            34,
            0x000000
        );

        // PLAYER HP
        this.playerHPBar = this.add.rectangle(
            220,
            40,
            300,
            30,
            0x00ff88
        );

        // =========================
        // ENEMY HP BG
        // =========================

        this.add.rectangle(
            1060,
            40,
            304,
            34,
            0x000000
        );

        // ENEMY HP
        this.enemyHPBar = this.add.rectangle(
            1060,
            40,
            300,
            30,
            0xff4444
        );

        // =========================
        // PLAYER NAME
        // =========================

        this.add.text(
            70,
            20,
            this.selectedCharacter,
            {
                fontSize: "28px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // =========================
        // ENEMY NAME
        // =========================

        this.add.text(
            1130,
            20,
            this.selectedEnemy,
            {
                fontSize: "28px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // =========================
        // ROUND TEXT
        // =========================

        this.roundText = this.add.text(
            640,
            70,
            "ROUND 1",
            {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        )
        .setOrigin(0.5);

        // =========================
        // CONTROLS TEXT
        // =========================

        this.add.text(
            20,
            680,
            "A/D = MOVE | SPACE = JUMP | CLICK = ATTACK",
            {
                fontSize: "22px",
                color: "#ffffff"
            }
        );

        // =========================
        // WINNER TEXT
        // =========================

        this.winnerText = this.add.text(
            640,
            300,
            "",
            {
                fontSize: "70px",
                fontStyle: "bold",
                color: "#ffff00",
                stroke: "#000000",
                strokeThickness: 10
            }
        )
        .setOrigin(0.5);

        this.winnerText.setVisible(
            false
        );

        // =========================
        // INPUT
        // =========================

        this.keys =
            this.input.keyboard.addKeys({

                left: "A",
                right: "D",
                jump: Phaser.Input.Keyboard.KeyCodes.SPACE

            });

        // =========================
        // STATE
        // =========================

        this.canAttack = true;

        this.gameEnded = false;

        // =========================
        // ATTACK INPUT
        // =========================

        this.input.on(
            "pointerdown",
            () => {

                if (
                    !this.canAttack ||
                    this.gameEnded
                ) {
                    return;
                }

                this.attack();

            }
        );

    }

    attack() {

        this.canAttack = false;

        // ATTACK EFFECT
        this.player.setTint(
            0xffaa00
        );

        this.time.delayedCall(
            120,
            () => {

                this.player.clearTint();

            }
        );

        // DISTANCE
        let distance =
            Phaser.Math.Distance.Between(

                this.player.x,
                this.player.y,

                this.enemy.x,
                this.enemy.y

            );

        // HIT
        if (distance < 220) {

            this.enemyHP -= 15;

            this.enemy.setTint(
                0xff0000
            );

            // SHAKE
            this.cameras.main.shake(
                120,
                0.01
            );

            // DAMAGE TEXT
            const damageText =
                this.add.text(

                    this.enemy.x,
                    this.enemy.y - 120,

                    "-15",

                    {
                        fontSize: "42px",
                        color: "#ff4444",
                        fontStyle: "bold",
                        stroke: "#000000",
                        strokeThickness: 6
                    }

                )
                .setOrigin(0.5);

            this.tweens.add({

                targets: damageText,

                y: damageText.y - 80,

                alpha: 0,

                duration: 700,

                onComplete: () => {

                    damageText.destroy();

                }

            });

            this.time.delayedCall(
                150,
                () => {

                    this.enemy.clearTint();

                }
            );

        }

        this.time.delayedCall(
            300,
            () => {

                this.canAttack = true;

            }
        );

    }

    update() {

        if (this.gameEnded) {
            return;
        }

        // =========================
        // RESET VELOCITY
        // =========================

        this.player.setVelocityX(0);

        // =========================
        // MOVE LEFT
        // =========================

        if (this.keys.left.isDown) {

            this.player.setVelocityX(
                -260
            );

            this.player.setFlipX(true);

        }

        // =========================
        // MOVE RIGHT
        // =========================

        else if (
            this.keys.right.isDown
        ) {

            this.player.setVelocityX(
                260
            );

            this.player.setFlipX(false);

        }

        // =========================
        // JUMP
        // =========================

        if (
            Phaser.Input.Keyboard.JustDown(
                this.keys.jump
            )
        ) {

            if (
                this.player.body.touching.down
            ) {

                this.player.setVelocityY(
                    -520
                );

            }

        }

        // =========================
        // SIMPLE ENEMY AI
        // =========================

        let distance =
            Phaser.Math.Distance.Between(

                this.player.x,
                this.player.y,

                this.enemy.x,
                this.enemy.y

            );

        if (
            this.enemy.x >
            this.player.x + 100
        ) {

            this.enemy.setVelocityX(
                -120
            );

            this.enemy.setFlipX(true);

        }

        else if (
            this.enemy.x <
            this.player.x - 100
        ) {

            this.enemy.setVelocityX(
                120
            );

            this.enemy.setFlipX(false);

        }

        else {

            this.enemy.setVelocityX(0);

            this.playerHP -= 0.08;

        }

        // =========================
        // CLAMP HP
        // =========================

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

        // =========================
        // UPDATE HP BAR
        // =========================

        this.playerHPBar.width =
            this.playerHP * 3;

        this.enemyHPBar.width =
            this.enemyHP * 3;

        // =========================
        // GAME OVER
        // =========================

        if (
            this.playerHP <= 0
        ) {

            this.endGame(
                this.selectedEnemy +
                " WINS"
            );

        }

        if (
            this.enemyHP <= 0
        ) {

            this.endGame(
                this.selectedCharacter +
                " WINS"
            );

        }

    }

    endGame(text) {

        if (this.gameEnded) {
            return;
        }

        this.gameEnded = true;

        this.physics.pause();

        this.winnerText.setText(
            text
        );

        this.winnerText.setVisible(
            true
        );

        this.cameras.main.shake(
            400,
            0.02
        );

        this.time.delayedCall(
            3000,
            () => {

                this.scene.start(
                    "MenuScene"
                );

            }
        );

    }

}