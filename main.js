import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { BattleScene } from './scenes/BattleScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false
        }
    },
    scene: [BootScene, MenuScene, BattleScene, GameOverScene],
    pixelArt: true,
    roundPixels: true
};

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.refresh();
});
