class CharacterSelectScene extends Phaser.Scene {

    constructor() {

        super("CharacterSelectScene");

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
            360,
            70,
            "SELECT YOUR CHARACTER",
            {
                fontSize: "48px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        // CHARACTER LIST
        const characters = [

            "Blaze",
            "Frost",
            "Volt",
            "Terra"

        ];

        let startX = 250;

        let startY = 220;

        characters.forEach((charName, index) => {

            const card =
                this.add.rectangle(

                    startX + (index * 250),
                    startY,

                    180,
                    220,

                    0x1e293b

                )
                .setStrokeStyle(
                    4,
                    0xffffff
                )
                .setInteractive();

            const text = this.add.text(

                card.x - 40,
                card.y + 70,

                charName,

                {
                    fontSize: "28px",
                    color: "#ffffff"
                }

            );

            // HOVER
            card.on(
                "pointerover",
                () => {

                    card.setFillStyle(
                        0x334155
                    );

                    card.setScale(1.05);

                }
            );

            card.on(
                "pointerout",
                () => {

                    card.setFillStyle(
                        0x1e293b
                    );

                    card.setScale(1);

                }
            );

            // CLICK
            card.on(
                "pointerdown",
                () => {

                    localStorage.setItem(
                        "selectedCharacter",
                        charName
                    );

                    this.scene.start(
                        "BattleScene"
                    );

                }
            );

        });

    }

}