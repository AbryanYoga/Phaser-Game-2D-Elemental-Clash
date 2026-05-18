class CharacterSelectScene extends Phaser.Scene {

    constructor() {
        super("CharacterSelectScene");
    }

    create() {

        this.add.text(430, 50, "SELECT YOUR CHARACTER", {
            fontSize: "40px",
            color: "#ffffff",
            fontStyle: "bold"
        });

        const characters = [
            "Blaze",
            "Frost",
            "Volt",
            "Aqua",
            "Terra",
            "Shadow"
        ];

        let startX = 150;
        let startY = 200;

        characters.forEach((charName, index) => {

            const card = this.add.rectangle(
                startX + (index % 3) * 320,
                startY + Math.floor(index / 3) * 250,
                220,
                150,
                0x222222
            )
            .setInteractive();

            const text = this.add.text(
                card.x - 40,
                card.y - 15,
                charName,
                {
                    fontSize: "28px",
                    color: "#ffffff"
                }
            );

            card.on("pointerover", () => {
                card.setFillStyle(0x555555);
            });

            card.on("pointerout", () => {
                card.setFillStyle(0x222222);
            });

            card.on("pointerdown", () => {

                localStorage.setItem("selectedCharacter", charName);

                this.scene.start("BattleScene");
            });
        });
    }
}