class CharacterSelectScene extends Phaser.Scene {

    constructor() {

        super("CharacterSelectScene");

    }

    preload() {

        // CHARACTER PREVIEW

        this.load.image(
            "blaze_preview",
            "assets/characters/Blaze/idle_1_Fire.png"
        );

        this.load.image(
            "frost_preview",
            "assets/characters/Frost/idle_1_Ice.png"
        );

        this.load.image(
            "volt_preview",
            "assets/characters/Volt/idle_1_Volt.png"
        );

        this.load.image(
            "arka_preview",
            "assets/characters/Arka/idle_1_Arka.png"
        );

    }

    create() {

        // =========================
        // BACKGROUND
        // =========================

        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x0f172a
        );

        // =========================
        // TITLE
        // =========================

        this.add.text(
            640,
            60,
            "SELECT YOUR CHARACTER",
            {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        )
        .setOrigin(0.5);

        // =========================
        // CHARACTER DATA
        // =========================

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
                preview: "frost_preview",
                description: "Ice Fighter"
            },

            {
                name: "Volt",
                color: 0xffff00,
                preview: "volt_preview",
                description: "Thunder God"
            },

            {
                name: "Arka",
                color: 0x66ff99,
                preview: "arka_preview",
                description: "Nusantara Warrior"
            }

        ];

        // =========================
        // CREATE CHARACTER CARDS
        // =========================

        this.characters.forEach((char, index) => {

            const x = 190 + (index * 300);
            const y = 370;

            // CARD BG
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

            // GLOW
            const glow = this.add.rectangle(
                x,
                y,
                240,
                340,
                char.color,
                0.12
            );

            glow.setVisible(false);

            // PREVIEW IMAGE
            const preview = this.add.image(
                x,
                y - 35,
                char.preview
            );

            // FIX SCALE
            preview.setScale(8);

            // NAME
            const nameText = this.add.text(
                x,
                y + 95,
                char.name,
                {
                    fontSize: "28px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            )
            .setOrigin(0.5);

            // DESC
            const descText = this.add.text(
                x,
                y + 130,
                char.description,
                {
                    fontSize: "18px",
                    color: "#cbd5e1"
                }
            )
            .setOrigin(0.5);

            // DEPTH
            glow.setDepth(0);
            card.setDepth(1);
            preview.setDepth(2);
            nameText.setDepth(2);
            descText.setDepth(2);

            // =========================
            // HOVER EFFECT
            // =========================

            card.on("pointerover", () => {

                glow.setVisible(true);

                this.tweens.add({

                    targets: [
                        card,
                        glow,
                        preview,
                        nameText,
                        descText
                    ],

                    y: "-=12",

                    duration: 120,

                    ease: "Power2"

                });

            });

            card.on("pointerout", () => {

                glow.setVisible(false);

                this.tweens.add({

                    targets: [
                        card,
                        glow,
                        preview,
                        nameText,
                        descText
                    ],

                    y: "+=12",

                    duration: 120,

                    ease: "Power2"

                });

            });

            // =========================
            // CLICK
            // =========================

            card.on("pointerdown", () => {

                localStorage.setItem(
                    "selectedCharacter",
                    char.name
                );

                this.cameras.main.flash(
                    250,
                    255,
                    255,
                    255
                );

                this.time.delayedCall(
                    250,
                    () => {

                        this.scene.start(
                            "MapSelectScene"
                        );

                    }
                );

            });

        });

        // =========================
        // BOTTOM INFO PANEL
        // =========================

        this.add.rectangle(
            640,
            660,
            500,
            55,
            0x111827,
            0.9
        );

        this.add.text(
            640,
            660,
            "Choose your elemental fighter",
            {
                fontSize: "22px",
                color: "#ffffff"
            }
        )
        .setOrigin(0.5);

    }

}