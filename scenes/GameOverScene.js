export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.result = data.result || 'DEFEAT';
    }

    create() {
        // Dark background
        this.add.rectangle(640, 360, 1280, 720, 0x000000, 0.8);

        const isVictory = this.result === 'VICTORY';
        
        // Title
        const title = this.add.text(640, 250, isVictory ? 'KEMENANGAN' : 'KEKALAHAN', {
            fontSize: '80px',
            fill: isVictory ? '#ffff00' : '#ff0000',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(640, 340, 
            isVictory ? 'Bathara Kala Telah Dikalahkan!' : 'Arka Telah Gugur...', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Main Menu Button (centered, no retry)
        const menuBtn = this.add.text(640, 450, 'MENU UTAMA', {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setStyle({ fill: isVictory ? '#ffff00' : '#ff0000' }))
        .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MenuScene');
        });
        
        // Fade in animation
        this.cameras.main.fadeIn(500, 0, 0, 0);
    }
}
