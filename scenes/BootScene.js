export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load UI assets if any
        this.load.setBaseURL('./');

        // Player
        this.load.spritesheet('player_idle', 'assets/player/idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('player_run', 'assets/player/run.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('player_attack', 'assets/player/attack.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('player_hurt', 'assets/player/hurt.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('player_dead', 'assets/player/dead.png', { frameWidth: 128, frameHeight: 128 });

        // Boss
        this.load.spritesheet('boss_idle', 'assets/boss/idle.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('boss_run', 'assets/boss/run.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('boss_attack', 'assets/boss/attack.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('boss_hurt', 'assets/boss/hurt.png', { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('boss_dead', 'assets/boss/dead.png', { frameWidth: 128, frameHeight: 128 });

        // Map
        this.load.image('background', 'assets/map/arena.png');

        // UI
        this.load.image('hp_player', 'assets/ui/hp_player.png');
        this.load.image('hp_boss', 'assets/ui/hp_boss.png');

        // Particles
        this.load.image('ember', 'assets/particles/ember.png');
        this.load.image('smoke', 'assets/particles/smoke.png');
        this.load.image('slash', 'assets/particles/slash.png');

        // Sounds
        this.load.audio('attack', 'assets/sounds/attack.wav');
        this.load.audio('hit', 'assets/sounds/hit.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('boss', 'assets/sounds/boss.wav');
        this.load.audio('bgm', 'assets/sounds/bgm.mp3');

        // Loading bar
        let progressBar = this.add.graphics();
        let progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xff0000, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            this.scene.start('MenuScene');
        });
    }
}
