class MenuScene extends Phaser.Scene {
    constructor() {
        super("MenuScene");
    }

    preload() {
    this.load.audio("click", "assets/sounds/click.mp3");
}

    create() {

        this.add.text(450, 120, "ELEMENTAL CLASH", {
            fontSize: "48px",
            color: "#ffffff",
            fontStyle: "bold"
        });

        const startButton = this.add.text(540, 300, "START GAME", {
            fontSize: "32px",
            backgroundColor: "#222",
            padding: {
                x: 20,
                y: 10
            }
        })
        .setInteractive();

        const exitButton = this.add.text(575, 400, "EXIT", {
            fontSize: "32px",
            backgroundColor: "#222",
            padding: {
                x: 20,
                y: 10
            }
        })
        .setInteractive();

        startButton.on("pointerover", () => {
            startButton.setStyle({
                backgroundColor: "#555"
            });
        });

        startButton.on("pointerout", () => {
            startButton.setStyle({
                backgroundColor: "#222"
            });
        });

        startButton.on("pointerdown", () => {
            this.scene.start("CharacterSelectScene");
        });

        exitButton.on("pointerover", () => {
            exitButton.setStyle({
                backgroundColor: "#555"
            });
        });

        exitButton.on("pointerout", () => {
            exitButton.setStyle({
                backgroundColor: "#222"
            });
        });

        exitButton.on("pointerdown", () => {
            window.close();
        });
    }
}