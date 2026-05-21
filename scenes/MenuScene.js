class MenuScene extends Phaser.Scene {

    constructor() {

        super("MenuScene");

    }

    preload() {

        this.load.audio(
            "click",
            "assets/sounds/click.mp3"
        );

    }

    create() {

        // ====================
        // BACKGROUND
        // ====================

        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x111827
        );

        // GLOW BACKGROUND
        const glow1 = this.add.circle(
            200,
            150,
            180,
            0xff6600,
            0.15
        );

        const glow2 = this.add.circle(
            1100,
            600,
            220,
            0x00ccff,
            0.12
        );

        // ====================
        // TITLE
        // ====================

        const title = this.add.text(
            315,
            140,
            "ELEMENTAL CLASH",
            {
                fontSize: "64px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // SHADOW EFFECT
        title.setShadow(
            0,
            0,
            "#ff6600",
            25,
            true,
            true
        );

        // ====================
        // SUBTITLE
        // ====================

        this.add.text(
            455,
            225,
            "Pixel Fighting Arena",
            {
                fontSize: "26px",
                color: "#cbd5e1"
            }
        );

        // ====================
        // START BUTTON
        // ====================

        const startButton = this.add.text(
            485,
            350,
            "START GAME",
            {
                fontSize: "38px",
                backgroundColor: "#1e293b",
                color: "#ffffff",

                padding: {
                    x: 35,
                    y: 18
                }
            }
        )
        .setInteractive();

        // ====================
        // FULLSCREEN BUTTON
        // ====================

        const fullscreenButton = this.add.text(
            510,
            450,
            "FULLSCREEN",
            {
                fontSize: "30px",
                backgroundColor: "#1e293b",
                color: "#ffffff",

                padding: {
                    x: 30,
                    y: 15
                }
            }
        )
        .setInteractive();

        // ====================
        // EXIT BUTTON
        // ====================

        const exitButton = this.add.text(
            565,
            550,
            "EXIT",
            {
                fontSize: "30px",
                backgroundColor: "#1e293b",
                color: "#ffffff",

                padding: {
                    x: 35,
                    y: 15
                }
            }
        )
        .setInteractive();

        // ====================
        // BUTTON ANIMATION
        // ====================

        const addHoverEffect = (button) => {

            button.on("pointerover", () => {

                button.setStyle({
                    backgroundColor: "#334155"
                });

                this.tweens.add({

                    targets: button,

                    scaleX: 1.08,
                    scaleY: 1.08,

                    duration: 100

                });

            });

            button.on("pointerout", () => {

                button.setStyle({
                    backgroundColor: "#1e293b"
                });

                this.tweens.add({

                    targets: button,

                    scaleX: 1,
                    scaleY: 1,

                    duration: 100

                });

            });

        };

        addHoverEffect(startButton);
        addHoverEffect(fullscreenButton);
        addHoverEffect(exitButton);

        // ====================
        // START GAME
        // ====================

        startButton.on("pointerdown", () => {

            this.sound.play("click");

            this.cameras.main.flash(
                200,
                255,
                255,
                255
            );

            this.time.delayedCall(
                200,
                () => {

                    this.scene.start(
                        "CharacterSelectScene"
                    );

                }
            );

        });

        // ====================
        // FULLSCREEN
        // ====================

        fullscreenButton.on("pointerdown", () => {

            this.sound.play("click");

            if (this.scale.isFullscreen) {

                this.scale.stopFullscreen();

            }
            else {

                this.scale.startFullscreen();

            }

        });

        // ====================
        // EXIT
        // ====================

        exitButton.on("pointerdown", () => {

            this.sound.play("click");

            window.close();

        });

        // ====================
        // FLOATING EFFECT
        // ====================

        this.tweens.add({

            targets: [
                glow1,
                glow2
            ],

            alpha: 0.25,

            duration: 2000,

            yoyo: true,

            repeat: -1

        });

    }

}