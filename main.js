const config = {

    type: Phaser.AUTO,

    width: 1280,

    height: 720,

    backgroundColor: "#111111",

    pixelArt: true,

    scale: {

        mode: Phaser.Scale.FIT,

        autoCenter: Phaser.Scale.CENTER_BOTH

    },

    physics: {

        default: "arcade",

        arcade: {

            gravity: {
                y: 700
            },

            debug: false

        }

    },

    scene: [

        MenuScene,
        CharacterSelectScene,
        BattleScene

    ]

};

window.onload = () => {

    new Phaser.Game(config);

};