class MapSelectScene extends Phaser.Scene {

    constructor() {

        super("MapSelectScene");

    }

    preload() {

        this.load.image(
            "arena_fire",
            "assets/backgrounds/arena_fire.png"
        );

        this.load.image(
            "arena_ice",
            "assets/backgrounds/arena_ice.png"
        );

        this.load.image(
            "arena_volt",
            "assets/backgrounds/arena_volt.png"
        );

        this.load.image(
            "arena_nusantara",
            "assets/backgrounds/arena_nusantara.png"
        );

    }

    create() {

        this.add.rectangle(
            640,
            360,
            1280,
            720,
            0x111827
        );

        this.add.text(
            470,
            50,
            "SELECT MAP",
            {
                fontSize: "52px",
                color: "#ffffff",
                fontStyle: "bold"
            }
        );

        this.maps = [

            {
                key: "arena_fire",
                title: "FIRE TEMPLE"
            },

            {
                key: "arena_ice",
                title: "ICE KINGDOM"
            },

            {
                key: "arena_volt",
                title: "THUNDER CITY"
            },

            {
                key: "arena_nusantara",
                title: "NUSANTARA LAND"
            }

        ];

        this.maps.forEach((map, index) => {

            let x = 190 + (index * 300);
            let y = 330;

            // MAP IMAGE
            const image = this.add.image(
                x,
                y,
                map.key
            );

            image.setDisplaySize(
                260,
                170
            );

            // BORDER
            const border = this.add.rectangle(
                x,
                y,
                270,
                180
            )
            .setStrokeStyle(
                5,
                0xffffff
            )
            .setInteractive();

            // DARK BG
            const panel = this.add.rectangle(
                x,
                y + 145,
                270,
                60,
                0x000000,
                0.7
            );

            // MAP TITLE
            const title = this.add.text(
                x,
                y + 145,
                map.title,
                {
                    fontSize: "22px",
                    color: "#ffffff",
                    fontStyle: "bold"
                }
            )
            .setOrigin(0.5);

            // HOVER
            border.on("pointerover", () => {

                border.setStrokeStyle(
                    6,
                    0xffff00
                );

                this.tweens.add({

                    targets: [
                        image,
                        border,
                        panel,
                        title
                    ],

                    y: "-=10",

                    duration: 120

                });

            });

            border.on("pointerout", () => {

                border.setStrokeStyle(
                    5,
                    0xffffff
                );

                this.tweens.add({

                    targets: [
                        image,
                        border,
                        panel,
                        title
                    ],

                    y: "+=10",

                    duration: 120

                });

            });

            // CLICK
            border.on("pointerdown", () => {

                localStorage.setItem(
                    "selectedMap",
                    map.key
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