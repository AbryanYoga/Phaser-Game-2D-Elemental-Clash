/**
 * ELEMENTAL CLASH - Fullscreen Manager
 * Reusable fullscreen utility for all scenes
 */

export class FullscreenManager {
    /**
     * Toggle fullscreen mode
     * @param {Phaser.Scene} scene - The scene calling this method
     */
    static toggle(scene) {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
            this.showNotification(scene, 'FULLSCREEN DISABLED');
        } else {
            scene.scale.startFullscreen();
            this.showNotification(scene, 'FULLSCREEN ENABLED');
        }
    }

    /**
     * Enter fullscreen mode
     * @param {Phaser.Scene} scene - The scene calling this method
     */
    static enter(scene) {
        if (!scene.scale.isFullscreen) {
            scene.scale.startFullscreen();
            this.showNotification(scene, 'FULLSCREEN ENABLED');
        }
    }

    /**
     * Exit fullscreen mode
     * @param {Phaser.Scene} scene - The scene calling this method
     */
    static exit(scene) {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen();
            this.showNotification(scene, 'FULLSCREEN DISABLED');
        }
    }

    /**
     * Check if currently in fullscreen
     * @param {Phaser.Scene} scene - The scene calling this method
     * @returns {boolean}
     */
    static isFullscreen(scene) {
        return scene.scale.isFullscreen;
    }

    /**
     * Show fullscreen notification
     * @param {Phaser.Scene} scene - The scene to show notification in
     * @param {string} message - The message to display
     */
    static showNotification(scene, message) {
        // Create notification background
        const notifBg = scene.add.rectangle(640, 100, 500, 80, 0x000000, 0.9)
            .setScrollFactor(0)
            .setDepth(10000);
        
        // Create notification text
        const notifText = scene.add.text(640, 100, message, {
            fontSize: '28px',
            fill: '#ffaa00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(10001);

        // Start invisible
        notifBg.setAlpha(0);
        notifText.setAlpha(0);

        // Fade in animation
        scene.tweens.add({
            targets: [notifBg, notifText],
            alpha: 1,
            duration: 300,
            ease: 'Power2'
        });

        // Auto-hide after 2 seconds
        scene.time.delayedCall(2000, () => {
            scene.tweens.add({
                targets: [notifBg, notifText],
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                    notifBg.destroy();
                    notifText.destroy();
                }
            });
        });
    }

    /**
     * Create a fullscreen button for a scene
     * @param {Phaser.Scene} scene - The scene to add button to
     * @param {number} x - X position
     * @param {number} y - Y position
     * @returns {Phaser.GameObjects.Text} The button object
     */
    static createButton(scene, x, y) {
        const btn = scene.add.text(x, y, 'FULLSCREEN', {
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0);

        // Hover effects
        btn.on('pointerover', () => {
            btn.setStyle({ fill: '#ffaa00' });
            btn.setScale(1.1);
        });

        btn.on('pointerout', () => {
            btn.setStyle({ fill: '#ffffff' });
            btn.setScale(1);
        });

        btn.on('pointerdown', () => {
            this.toggle(scene);
        });

        return btn;
    }

    /**
     * Setup F11 keyboard shortcut for a scene
     * @param {Phaser.Scene} scene - The scene to setup shortcut for
     */
    static setupKeyboardShortcut(scene) {
        scene.input.keyboard.on('keydown-F11', (event) => {
            event.preventDefault();
            this.toggle(scene);
        });
    }
}
