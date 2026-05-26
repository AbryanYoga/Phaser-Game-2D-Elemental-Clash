export class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load UI assets if any
        this.load.setBaseURL('./');

        // Player - Arka Character
        this.load.image('player_idle_1', 'assets/characters/Arka/idle/idle_1.png');
        this.load.image('player_idle_2', 'assets/characters/Arka/idle/idle_2.png');
        this.load.image('player_idle_3', 'assets/characters/Arka/idle/idle_3.png');
        this.load.image('player_idle_4', 'assets/characters/Arka/idle/idle_4.png');
        this.load.image('player_idle_5', 'assets/characters/Arka/idle/idle_5.png');
        
        this.load.image('player_run_1', 'assets/characters/Arka/run/run_1.png');
        this.load.image('player_run_2', 'assets/characters/Arka/run/run_2.png');
        this.load.image('player_run_3', 'assets/characters/Arka/run/run_3.png');
        this.load.image('player_run_4', 'assets/characters/Arka/run/run_4.png');
        this.load.image('player_run_5', 'assets/characters/Arka/run/run_5.png');
        this.load.image('player_run_6', 'assets/characters/Arka/run/run_6.png');
        
        this.load.image('player_jump_1', 'assets/characters/Arka/jump/jump_1.png');
        this.load.image('player_jump_2', 'assets/characters/Arka/jump/jump_2.png');
        this.load.image('player_jump_3', 'assets/characters/Arka/jump/jump_3.png');
        this.load.image('player_jump_4', 'assets/characters/Arka/jump/jump_4.png');
        
        this.load.image('player_attack_1', 'assets/characters/Arka/attack/attack_1.png');
        this.load.image('player_attack_2', 'assets/characters/Arka/attack/attack_2.png');
        this.load.image('player_attack_3', 'assets/characters/Arka/attack/attack_3.png');
        this.load.image('player_attack_4', 'assets/characters/Arka/attack/attack_4.png');
        this.load.image('player_attack_5', 'assets/characters/Arka/attack/attack_5.png');
        
        this.load.image('player_dead', 'assets/characters/Arka/dead/dead.png');
        this.load.image('player_win', 'assets/characters/Arka/win/win.png');

        // Boss - Bathara Kala
        this.load.image('boss_idle_1', 'assets/bathara kala/idle_1boss.png');
        this.load.image('boss_idle_2', 'assets/bathara kala/idle_2boss.png');
        this.load.image('boss_idle_3', 'assets/bathara kala/idle_3boss.png');
        this.load.image('boss_idle_4', 'assets/bathara kala/idle_4boss.png');
        
        this.load.image('boss_run_1', 'assets/bathara kala/run_1boss.png');
        this.load.image('boss_run_2', 'assets/bathara kala/run_2boss.png');
        this.load.image('boss_run_3', 'assets/bathara kala/run_3boss.png');
        this.load.image('boss_run_4', 'assets/bathara kala/run_4boss.png');
        this.load.image('boss_run_5', 'assets/bathara kala/run_5boss.png');
        
        this.load.image('boss_attack_1', 'assets/bathara kala/attack_1boss.png');
        this.load.image('boss_attack_2', 'assets/bathara kala/attack_2boss.png');
        this.load.image('boss_attack_3', 'assets/bathara kala/attack_3boss.png');
        this.load.image('boss_attack_4', 'assets/bathara kala/attack_4boss.png');
        
        this.load.image('boss_hurt_1', 'assets/bathara kala/hurt_1boss.png');
        this.load.image('boss_hurt_2', 'assets/bathara kala/hurt_2boss.png');
        
        this.load.image('boss_dead_1', 'assets/bathara kala/dead_1boss.png');
        this.load.image('boss_dead_2', 'assets/bathara kala/dead_2boss.png');
        this.load.image('boss_dead_3', 'assets/bathara kala/dead_3boss.png');

        // Map - Throne Room
        this.load.image('background', 'assets/map/2/throne room.png');
        this.load.image('map_layer_1', 'assets/map/2/1.png');
        this.load.image('map_layer_2', 'assets/map/2/2.png');
        this.load.image('map_layer_3', 'assets/map/2/3.png');
        this.load.image('map_layer_4', 'assets/map/2/4.png');
        this.load.image('platform', 'assets/map/2/5.png');

        // UI
        this.load.image('hp_player', 'assets/ui/hp_player.png');
        this.load.image('hp_boss', 'assets/ui/hp_boss.png');

        // Particles
        this.load.image('particle', 'assets/particles/particle.png');
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

        this.load.on('loaderror', (file) => {
            console.error('[BootScene] Failed to load:', file.key, file.src);
        });

        this.load.on('filecomplete', (key) => {
            if (key.startsWith('player_run')) {
                console.log('[BootScene] Loaded:', key);
            }
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            
            // Verify run textures loaded
            console.log('[BootScene] Checking run textures...');
            for (let i = 1; i <= 6; i++) {
                const key = `player_run_${i}`;
                const exists = this.textures.exists(key);
                console.log(`[BootScene] ${key}: ${exists ? '✓' : '✗'}`);
            }
            
            this.scene.start('MenuScene');
        });
    }
}
