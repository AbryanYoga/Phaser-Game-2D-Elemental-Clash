/**
 * ELEMENTAL CLASH - Settings Scene
 * Audio settings with localStorage persistence
 */

export class SettingsScene extends Phaser.Scene {
    constructor() {
        super('SettingsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#0a0a1a');

        // Load settings from localStorage
        this.loadSettings();

        // Title
        this.add.text(640, 120, 'SETTINGS', {
            fontSize: '64px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // BGM Setting
        this.createToggle('BGM', 280, 'bgmEnabled');

        // SFX Setting
        this.createToggle('SFX', 380, 'sfxEnabled');

        // Back button
        this.createBackButton();

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    loadSettings() {
        // Load from localStorage or use defaults
        const bgmEnabled = localStorage.getItem('bgmEnabled');
        const sfxEnabled = localStorage.getItem('sfxEnabled');

        this.registry.set('bgmEnabled', bgmEnabled !== 'false');
        this.registry.set('sfxEnabled', sfxEnabled !== 'false');

        // Apply BGM setting
        if (this.registry.get('bgmEnabled') === false) {
            const bgm = this.sound.get('bgm');
            if (bgm && bgm.isPlaying) {
                bgm.stop();
            }
        }
    }

    createToggle(label, y, settingKey) {
        // Label
        this.add.text(400, y, label + ':', {
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(1, 0.5);

        // Get current value
        const isEnabled = this.registry.get(settingKey) !== false;

        // Toggle button background
        const toggleBg = this.add.rectangle(640, y, 120, 50, 0x333333)
            .setStrokeStyle(3, 0xffffff)
            .setInteractive({ useHandCursor: true });

        // Toggle indicator
        const toggleIndicator = this.add.circle(
            isEnabled ? 670 : 610, 
            y, 
            20, 
            isEnabled ? 0x00ff00 : 0xff0000
        );

        // Status text
        const statusText = this.add.text(780, y, isEnabled ? 'ON' : 'OFF', {
            fontSize: '32px',
            fill: isEnabled ? '#00ff00' : '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);

        // Toggle interaction
        toggleBg.on('pointerdown', () => {
            const newValue = !this.registry.get(settingKey);
            this.registry.set(settingKey, newValue);
            localStorage.setItem(settingKey, newValue.toString());

            // Update visuals
            this.tweens.add({
                targets: toggleIndicator,
                x: newValue ? 670 : 610,
                duration: 200,
                ease: 'Power2'
            });

            toggleIndicator.setFillStyle(newValue ? 0x00ff00 : 0xff0000);
            statusText.setText(newValue ? 'ON' : 'OFF');
            statusText.setColor(newValue ? '#00ff00' : '#ff0000');

            // Apply settings
            if (settingKey === 'bgmEnabled') {
                if (newValue) {
                    let bgm = this.sound.get('bgm');
                    if (!bgm) {
                        bgm = this.sound.add('bgm');
                    }
                    if (!bgm.isPlaying) {
                        bgm.play({ loop: true, volume: 0.3 });
                    }
                } else {
                    const bgm = this.sound.get('bgm');
                    if (bgm && bgm.isPlaying) {
                        bgm.stop();
                    }
                }
            }

            // Play feedback sound
            if (this.registry.get('sfxEnabled')) {
                this.sound.play('hit', { volume: 0.3, rate: 1.5 });
            }
        });

        // Hover effect
        toggleBg.on('pointerover', () => {
            toggleBg.setStrokeStyle(3, 0xffaa00);
        });

        toggleBg.on('pointerout', () => {
            toggleBg.setStrokeStyle(3, 0xffffff);
        });
    }

    createBackButton() {
        const backBtn = this.add.text(640, 550, 'BACK', {
            fontSize: '40px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => {
            backBtn.setStyle({ fill: '#ffaa00' });
            backBtn.setScale(1.1);
            if (this.registry.get('sfxEnabled')) {
                this.sound.play('hit', { volume: 0.2, rate: 2 });
            }
        });

        backBtn.on('pointerout', () => {
            backBtn.setStyle({ fill: '#ffffff' });
            backBtn.setScale(1);
        });

        backBtn.on('pointerdown', () => {
            if (this.registry.get('sfxEnabled')) {
                this.sound.play('attack', { volume: 0.3 });
            }
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('MainMenuScene');
            });
        });
    }
}
