class CharacterSelectScene extends Phaser.Scene {

    constructor() {

        super("CharacterSelectScene");

    }

    preload() {

        this.load.image(
            "blaze_preview",
            "assets/characters/Blaze/idle_1_Fire.png"
        );

    }

    create() {

        // BACKGROUND
        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x0f172a
        );

        // TITLE
        this.add.text(
            350,
            50,
            "SELECT YOUR CHARACTER",
            {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // CHARACTER DATA
        this.characters = [

            {
                name: "Blaze",
                color: 0xff6600,
                preview: "blaze_preview",
                description: "Fire Fighter"
            },

            {
                name: "Frost",
                color: 0x66ccff,
                preview: "blaze_preview",
                description: "Ice Fighter"
            },

            {
                name: "Volt",
                color: 0xffff00,
                preview: "blaze_preview",
                description: "Lightning Fighter"
            },

            {
                name: "Arka",
                color: 0x66ff99,
                preview: "blaze_preview",
                description: "Nusantara Warrior"
            }

        ];

        // CREATE CHARACTER CARDS
        this.characters.forEach((char, index) => {

            let x = 190 + (index * 300);
            let y = 360;

            // GLOW
            const glow = this.add.rectangle(
                x,
                y,
                250,
                360,
                char.color,
                0.15
            );

            glow.setVisible(false);

            // CARD
            const card = this.add.rectangle(
                x,
                y,
                240,
                340,
                0x1e293b
            )
            .setStrokeStyle(
                5,
                char.color
            )
            .setInteractive();

            // PREVIEW
            const preview = this.add.image(
                x,
                y - 50,
                char.preview
            );

            preview.setScale(12);

            // NAME
            const nameText = this.add.text(
                x - 50,
                y + 80,
                char.name,
                {
                    fontSize: "30px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            );

            // DESC
            const descText = this.add.text(
                x - 80,
                y + 120,
                char.description,
                {
                    fontSize: "18px",
                    color: "#cbd5e1"
                }
            );

            // DEPTH
            glow.setDepth(0);
            card.setDepth(1);
            preview.setDepth(2);
            nameText.setDepth(2);
            descText.setDepth(2);

            // HOVER
            card.on("pointerover", () => {

                glow.setVisible(true);

                this.tweens.add({

                    targets: [
                        card,
                        preview
                    ],

                    scaleX: 1.05,
                    scaleY: 1.05,

                    duration: 120

                });

            });

            card.on("pointerout", () => {

                glow.setVisible(false);

                this.tweens.add({

                    targets: [
                        card,
                        preview
                    ],

                    scaleX: 1,
                    scaleY: 1,

                    duration: 120

                });

            });

            // CLICK
            card.on("pointerdown", () => {

                localStorage.setItem(
                    "selectedCharacter",
                    char.name
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

        // INFO PANEL
        this.add.rectangle(
            640,
            650,
            500,
            60,
            0x111827,
            0.9
        );

        this.add.text(
            430,
            635,
            "Choose your elemental fighter",
            {
                fontSize: "24px",
                color: "#ffffff"
            }
        );

    }

}