class BattleScene extends Phaser.Scene {

    constructor() {
        super("BattleScene");
    }

    preload() {

        // SOUND
        this.load.audio("jump", "assets/sounds/jump.mp3");
        this.load.audio("dash", "assets/sounds/dash.mp3");
        this.load.audio("hit", "assets/sounds/hit.mp3");
        this.load.audio("special", "assets/sounds/special.mp3");

    }

    create() {

        // BACKGROUND
        this.add.rectangle(640, 360, 1280, 720, 0x1e293b);

        // PLAYER HP BAR
        this.playerHPBar = this.add.rectangle(
            250,
            50,
            300,
            30,
            0x00ff00
        );

        // ENEMY HP BAR
        this.enemyHPBar = this.add.rectangle(
            1030,
            50,
            300,
            30,
            0x00ff00
        );

        // ENERGY BAR
        this.energyBar = this.add.rectangle(
            250,
            90,
            300,
            20,
            0x00ffff
        );

        // TIMER
        this.timerText = this.add.text(610, 35, "60", {
            fontSize: "32px",
            color: "#ffffff"
        });

        // GROUND
        this.ground = this.add.rectangle(
            640,
            680,
            1280,
            80,
            0x444444
        );

        this.physics.add.existing(this.ground, true);

        // PLAYER
        this.player = this.physics.add.sprite(200, 500, null);

        this.player.setDisplaySize(80, 120);

        this.player.setTint(0x00ffff);

        this.player.setCollideWorldBounds(true);

        // ENEMY
        this.enemy = this.physics.add.sprite(1000, 500, null);

        this.enemy.setDisplaySize(80, 120);

        this.enemy.setTint(0xff0000);

        this.enemy.setCollideWorldBounds(true);

        // COLLISION
        this.physics.add.collider(
            this.player,
            this.ground
        );

        this.physics.add.collider(
            this.enemy,
            this.ground
        );

        // KEYBOARD
        this.keys = this.input.keyboard.addKeys({
            left: "A",
            right: "D",
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            skill: Phaser.Input.Keyboard.KeyCodes.F
        });

        // DOUBLE JUMP
        this.jumpCount = 0;

        // DASH
        this.lastLeftPress = 0;
        this.lastRightPress = 0;

        // GAMEPAD
        this.pad = null;

        this.input.gamepad.once("connected", (pad) => {

            this.pad = pad;

            console.log("Gamepad Connected");

        });

        // HP
        this.playerHP = 100;
        this.enemyHP = 100;

        // ENERGY
        this.playerEnergy = 100;
        this.maxEnergy = 100;

        // TIMER
        this.timeLeft = 60;

        // TIMER EVENT
        this.time.addEvent({

            delay: 1000,

            callback: () => {

                this.timeLeft--;

                this.timerText.setText(this.timeLeft);

            },

            loop: true

        });

        // BASIC ATTACK MOUSE
        this.input.on("pointerdown", () => {

            let distance = Phaser.Math.Distance.Between(
                this.player.x,
                this.player.y,
                this.enemy.x,
                this.enemy.y
            );

            if (distance < 150) {

                this.enemyHP -= 10;

                this.sound.play("hit");

                this.cameras.main.shake(100, 0.01);

                // KNOCKBACK
                if (this.enemy.x > this.player.x) {

                    this.enemy.setVelocityX(400);

                }
                else {

                    this.enemy.setVelocityX(-400);

                }

            }

        });

        // SPECIAL EFFECT
        this.skillEffect = this.add.circle(
            this.player.x,
            this.player.y,
            50,
            0x00ffff
        );

        this.skillEffect.setVisible(false);

    }

    update() {

        // RESET MOVEMENT
        this.player.setVelocityX(0);

        // MOVE LEFT
        if (this.keys.left.isDown) {

            this.player.setVelocityX(-250);

        }

        // MOVE RIGHT
        else if (this.keys.right.isDown) {

            this.player.setVelocityX(250);

        }

        // DOUBLE JUMP
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {

            if (this.jumpCount < 2) {

                this.player.setVelocityY(-450);

                this.sound.play("jump");

                this.jumpCount++;

            }

        }

        // RESET JUMP
        if (this.player.body.touching.down) {

            this.jumpCount = 0;

        }

        // DASH LEFT
        if (Phaser.Input.Keyboard.JustDown(this.keys.left)) {

            let time = this.time.now;

            if (time - this.lastLeftPress < 300) {

                this.player.setVelocityX(-500);

                this.sound.play("dash");

            }

            this.lastLeftPress = time;

        }

        // DASH RIGHT
        if (Phaser.Input.Keyboard.JustDown(this.keys.right)) {

            let time = this.time.now;

            if (time - this.lastRightPress < 300) {

                this.player.setVelocityX(500);

                this.sound.play("dash");

            }

            this.lastRightPress = time;

        }

        // GAMEPAD
        if (this.pad) {

            let axisX = this.pad.axes[0].getValue();

            // MOVE
            if (axisX < -0.1) {

                this.player.setVelocityX(-250);

            }
            else if (axisX > 0.1) {

                this.player.setVelocityX(250);

            }

            // JUMP
            if (this.pad.buttons[0].pressed) {

                if (this.jumpCount < 2) {

                    this.player.setVelocityY(-450);

                    this.jumpCount++;

                }

            }

        }

        // AI MOVEMENT
        if (this.enemy.x > this.player.x + 50) {

            this.enemy.setVelocityX(-150);

        }
        else if (this.enemy.x < this.player.x - 50) {

            this.enemy.setVelocityX(150);

        }
        else {

            this.enemy.setVelocityX(0);

        }

        // AI ATTACK
        let enemyDistance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.enemy.x,
            this.enemy.y
        );

        if (enemyDistance < 120) {

            this.playerHP -= 0.1;

        }

        // SPECIAL SKILL
        if (Phaser.Input.Keyboard.JustDown(this.keys.skill)) {

            // CHECK ENERGY
            if (this.playerEnergy >= 30) {

                this.playerEnergy -= 30;

                this.sound.play("special");

                // EFFECT
                this.skillEffect.setVisible(true);

                this.skillEffect.x = this.player.x;

                this.skillEffect.y = this.player.y;

                // ELEMENT COLOR
                this.skillEffect.fillColor = 0x00ffff;

                this.time.delayedCall(200, () => {

                    this.skillEffect.setVisible(false);

                });

                // CAMERA SHAKE
                this.cameras.main.shake(200, 0.02);

                // DAMAGE
                let distance = Phaser.Math.Distance.Between(
                    this.player.x,
                    this.player.y,
                    this.enemy.x,
                    this.enemy.y
                );

                if (distance < 250) {

                    this.enemyHP -= 25;

                    // STRONG KNOCKBACK
                    if (this.enemy.x > this.player.x) {

                        this.enemy.setVelocityX(700);

                    }
                    else {

                        this.enemy.setVelocityX(-700);

                    }

                }

            }

        }

        // ENERGY REGEN
        this.playerEnergy += 0.2;

        // UPDATE HP BAR
        this.playerHPBar.width = this.playerHP * 3;

        this.enemyHPBar.width = this.enemyHP * 3;

        // UPDATE ENERGY BAR
        this.energyBar.width = this.playerEnergy * 3;

        // CLAMP HP
        this.playerHP = Phaser.Math.Clamp(
            this.playerHP,
            0,
            100
        );

        this.enemyHP = Phaser.Math.Clamp(
            this.enemyHP,
            0,
            100
        );

        // CLAMP ENERGY
        this.playerEnergy = Phaser.Math.Clamp(
            this.playerEnergy,
            0,
            100
        );

        // GAME OVER
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