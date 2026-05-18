const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: "#111111",

    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 700},
            debug: false
        }
    },

    scene: [
        MenuScene,
        CharacterSelectScene,
        BattleScene
    ]
};

const game = new Phaser.Game(config);