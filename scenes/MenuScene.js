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

        // BACKGROUND
        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x111827
        );

        // TITLE
        this.add.text(
            350,
            120,
            "ELEMENTAL CLASH",
            {
                fontSize: "64px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // SUBTITLE
        this.add.text(
            470,
            200,
            "Pixel Fighting Arena",
            {
                fontSize: "24px",
                color: "#aaaaaa"
            }
        );

        // START BUTTON
        const startButton = this.add.text(
            500,
            320,
            "START GAME",
            {
                fontSize: "36px",
                backgroundColor: "#222222",
                color: "#ffffff",

                padding: {
                    x: 30,
                    y: 15
                }
            }
        )
        .setInteractive();

        // EXIT BUTTON
        const exitButton = this.add.text(
            565,
            430,
            "EXIT",
            {
                fontSize: "32px",
                backgroundColor: "#222222",
                color: "#ffffff",

                padding: {
                    x: 30,
                    y: 15
                }
            }
        )
        .setInteractive();

        // HOVER
        startButton.on("pointerover", () => {

            startButton.setStyle({
                backgroundColor: "#444444"
            });

        });

        startButton.on("pointerout", () => {

            startButton.setStyle({
                backgroundColor: "#222222"
            });

        });

        exitButton.on("pointerover", () => {

            exitButton.setStyle({
                backgroundColor: "#444444"
            });

        });

        exitButton.on("pointerout", () => {

            exitButton.setStyle({
                backgroundColor: "#222222"
            });

        });

        // CLICK
        startButton.on("pointerdown", () => {

            this.sound.play("click");

            this.scene.start(
                "CharacterSelectScene"
            );

        });

        exitButton.on("pointerdown", () => {

            this.sound.play("click");

            window.close();

        });

    }

}