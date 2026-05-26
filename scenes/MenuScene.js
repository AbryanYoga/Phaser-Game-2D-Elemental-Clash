export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    init() {
        // Initialize default audio preferences if not already set
        if (this.registry.get('musicEnabled') === undefined) {
            this.registry.set('musicEnabled', true);
        }
        if (this.registry.get('sfxEnabled') === undefined) {
            this.registry.set('sfxEnabled', true);
        }
    }

    create() {
        // Set background (map/arena.png)
        this.add.image(640, 360, 'background').setAlpha(0.6).setDisplaySize(1280, 720);

        // Title text
        this.titleText = this.add.text(640, 200, 'DARK FANTASY\nBOSS FIGHT', {
            fontSize: '80px',
            fill: '#e63946',
            align: 'center',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8,
            shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 4, stroke: true, fill: true }
        }).setOrigin(0.5);

        // Button lists
        this.mainMenuButtons = [];
        this.settingsButtons = [];

        // Setup Main Menu
        this.createMainMenu();

        // Setup Settings Menu (initially hidden)
        this.createSettingsMenu();

        // Slow cinematic smoke/fog overlay
        this.fog = this.add.graphics();
        this.fog.fillStyle(0x0a001a, 0.25);
        this.fog.fillRect(0, 0, 1280, 720);
        
        // Dynamic red pulsing light aura from bottom
        this.aura = this.add.graphics();
        this.aura.fillStyle(0x9d0208, 0.15);
        this.aura.fillRect(0, 600, 1280, 120);
        
        this.tweens.add({
            targets: this.aura,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1
        });
    }

    createMainMenu() {
        const createMenuBtn = (y, label, callback) => {
            const btn = this.add.text(640, y, label, {
                fontSize: '40px',
                fill: '#ffffff',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setStyle({ fill: '#ff4d6d' }))
            .on('pointerout', () => btn.setStyle({ fill: '#ffffff' }))
            .on('pointerdown', callback);
            
            this.mainMenuButtons.push(btn);
            return btn;
        };

        createMenuBtn(350, 'START STORY', () => {
            this.scene.start('IntroScene');
        });

        createMenuBtn(430, 'SKIP TO BATTLE', () => {
            this.scene.start('BattleScene');
        });

        createMenuBtn(510, 'SETTINGS', () => {
            this.showSettings(true);
        });

        createMenuBtn(590, 'EXIT', () => {
            if (confirm('Exit game?')) {
                // Try window close
                window.close();
                // Fallback for browsers that don't allow window.close()
                const body = document.querySelector('body');
                if (body) {
                    body.innerHTML = '<div style="color:red; font-size:40px; text-align:center; margin-top:200px;">Game Exited. Close this tab.</div>';
                }
            }
        });
    }

    createSettingsMenu() {
        const createSettingBtn = (y, getLabel, toggleCallback) => {
            const btn = this.add.text(400, y, getLabel(), {
                fontSize: '28px',
                fill: '#ffb703',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => btn.setStyle({ fill: '#ffb703', strokeThickness: 6 }))
            .on('pointerout', () => btn.setStyle({ fill: '#ffb703', strokeThickness: 4 }))
            .on('pointerdown', () => {
                toggleCallback();
                btn.setText(getLabel());
            });
            
            btn.setVisible(false);
            this.settingsButtons.push(btn);
            return btn;
        };

        // Music Toggle Button
        createSettingBtn(300, 
            () => `MUSIC: ${this.registry.get('musicEnabled') ? 'ENABLED' : 'MUTED'}`, 
            () => {
                const cur = this.registry.get('musicEnabled');
                this.registry.set('musicEnabled', !cur);
            }
        );

        // SFX Toggle Button
        createSettingBtn(370, 
            () => `SFX: ${this.registry.get('sfxEnabled') ? 'ENABLED' : 'MUTED'}`, 
            () => {
                const cur = this.registry.get('sfxEnabled');
                this.registry.set('sfxEnabled', !cur);
            }
        );

        // Back Button
        const backBtn = this.add.text(400, 450, 'BACK TO MENU', {
            fontSize: '28px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backBtn.setStyle({ fill: '#ff4d6d' }))
        .on('pointerout', () => backBtn.setStyle({ fill: '#ffffff' }))
        .on('pointerdown', () => {
            this.showSettings(false);
        });

        backBtn.setVisible(false);
        this.settingsButtons.push(backBtn);
    }

    showSettings(show) {
        if (show) {
            this.titleText.setText('SETTINGS');
            this.mainMenuButtons.forEach(btn => btn.setVisible(false));
            this.settingsButtons.forEach(btn => {
                btn.setVisible(true);
                // Refresh texts if they display dynamic states
                if (btn.text.startsWith('MUSIC')) {
                    btn.setText(`MUSIC: ${this.registry.get('musicEnabled') ? 'ENABLED' : 'MUTED'}`);
                } else if (btn.text.startsWith('SFX')) {
                    btn.setText(`SFX: ${this.registry.get('sfxEnabled') ? 'ENABLED' : 'MUTED'}`);
                }
            });
        } else {
            this.titleText.setText('DARK FANTASY\nBOSS FIGHT');
            this.settingsButtons.forEach(btn => btn.setVisible(false));
            this.mainMenuButtons.forEach(btn => btn.setVisible(true));
        }
    }
}
