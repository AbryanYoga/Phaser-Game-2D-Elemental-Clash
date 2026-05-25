export class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.result = data.result || 'GAME OVER';
    }

    create() {
        this.add.image(400, 300, 'background').setAlpha(0.3);

        const title = this.add.text(400, 250, this.result, {
            fontSize: '80px',
            fill: this.result === 'YOU DIED' ? '#ff0000' : '#ffff00',
            fontStyle: 'bold',
            stroke: '#000',
            strokeThickness: 8
        }).setOrigin(0.5);

        const retryBtn = this.add.text(400, 400, 'RETRY', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => retryBtn.setStyle({ fill: '#ff0000' }))
        .on('pointerout', () => retryBtn.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('BattleScene');
        });

        const menuBtn = this.add.text(400, 470, 'MAIN MENU', {
            fontSize: '32px',
            fill: '#ffffff'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => menuBtn.setStyle({ fill: '#ff0000' }))
        .on('pointerout', () => menuBtn.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.sound.stopAll();
            this.scene.start('MenuScene');
        });
    }
}
