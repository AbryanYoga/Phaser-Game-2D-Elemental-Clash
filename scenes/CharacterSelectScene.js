class CharacterSelectScene extends Phaser.Scene {

    constructor() {

        super("CharacterSelectScene");

    }

    preload() {

        this.load.image(
            "blaze_portrait",
            "assets/portraits/blaze.png"
        );

        this.load.image(
            "frost_portrait",
            "assets/portraits/frost.png"
        );

        this.load.image(
            "volt_portrait",
            "assets/portraits/volt.png"
        );

        this.load.image(
            "arka_portrait",
            "assets/portraits/arka.png"
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
            360,
            60,
            "SELECT YOUR FIGHTER",
            {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold",
                stroke: "#ff6600",
                strokeThickness: 6
            }
        );

        // CHARACTER LIST
        const characters = [

            {
                name: "Blaze",
                portrait: "blaze_portrait",
                color: 0xff6600
            },

            {
                name: "Frost",
                portrait: "frost_portrait",
                color: 0x66ccff
            },

            {
                name: "Volt",
                portrait: "volt_portrait",
                color: 0xffff00
            },

            {
                name: "Arka",
                portrait: "arka_portrait",
                color: 0x66ff99
            }

];

        let startX = 250;

        let startY = 220;

        characters.forEach((charData, index) => {

            const posX =
                startX + (index % 2) * 420;

            const posY =
                startY + Math.floor(index / 2) * 250;

            // CARD
            const card = this.add.rectangle(
                posX,
                posY,
                320,
                180,
                0x222222
            )
            .setStrokeStyle(
                4,
                charData.color
            )
            .setInteractive();

            // PORTRAIT
            const portrait = this.add.image(
                posX,
                posY - 10,
                charData.portrait
            );

            portrait.setScale(3);

            // NAME
            const text = this.add.text(
                posX - 45,
                posY + 60,
                charData.name,
                {
                    fontSize: "28px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            );

            // HOVER
            card.on("pointerover", () => {

                card.setFillStyle(0x444444);

                this.tweens.add({

                    targets: card,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 120

                });

            });

            // OUT
            card.on("pointerout", () => {

                card.setFillStyle(0x222222);

                this.tweens.add({

                    targets: card,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 120

                });

            });

            // CLICK
            card.on("pointerdown", () => {

                localStorage.setItem(
                    "selectedCharacter",
                    charData.name
                );

                this.cameras.main.flash(
                    300,
                    255,
                    255,
                    255
                );

                this.time.delayedCall(
                    300,
                    () => {

                        this.scene.start(
                            "BattleScene"
                        );

                    }
                );

            });

        });
    }

}