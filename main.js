const config = {

    type: Phaser.AUTO,

    width: 1280,

    height: 720,

    parent: "game-container",

    backgroundColor: "#000000",

    pixelArt: true,

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 1000
            },

            debug: false

        }

    },

    scene: [

        MenuScene,
        CharacterSelectScene,
        MapSelectScene,
        BattleScene

    ]

};

const game = new Phaser.Game(config);