export class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // State management
        this.cutsceneStep = 0;
        this.canSkip = false;
        this.isDialogueActive = false;
        this.cinematicBarsVisible = false;
        this.isSkipping = false;  // Flag to prevent double ESC trigger
        
        // Create all visual elements
        this.createVisuals();
        this.createCinematicBars();
        this.createAudio();
        
        // Start cutscene sequence
        this.time.delayedCall(1000, () => {
            this.startCutscene();
        });
        
        // Skip cutscene with ESC - FIXED: prevent double trigger
        this.escKey = this.input.keyboard.addKey('ESC');
        this.escKey.on('down', () => {
            if (this.canSkip && !this.isSkipping) {
                this.skipToGame();
            }
        });
    }

    createCinematicBars() {
        // Top and bottom black bars for cinematic effect
        this.topBar = this.add.rectangle(640, 0, 1280, 100, 0x000000, 1);
        this.topBar.setOrigin(0.5, 0);
        this.topBar.setDepth(90);
        this.topBar.setAlpha(0);
        
        this.bottomBar = this.add.rectangle(640, 720, 1280, 100, 0x000000, 1);
        this.bottomBar.setOrigin(0.5, 1);
        this.bottomBar.setDepth(90);
        this.bottomBar.setAlpha(0);
    }

    showCinematicBars() {
        this.cinematicBarsVisible = true;
        this.tweens.add({
            targets: [this.topBar, this.bottomBar],
            alpha: 1,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
    }

    hideCinematicBars() {
        this.cinematicBarsVisible = false;
        this.tweens.add({
            targets: [this.topBar, this.bottomBar],
            alpha: 0,
            duration: 1000,
            ease: 'Sine.easeInOut'
        });
    }

    createVisuals() {
        // Black overlay for fade effects
        this.blackOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 1);
        this.blackOverlay.setDepth(1000);
        
        // Opening text container
        this.openingTextContainer = this.add.container(640, 360);
        this.openingTextContainer.setAlpha(0);
        this.openingTextContainer.setDepth(10);
        
        // Indonesian village background (dark blue night)
        this.villageBackground = this.add.rectangle(640, 360, 1280, 720, 0x0a0a1a);
        this.villageBackground.setAlpha(0);
        
        // Red moon (hidden behind clouds initially)
        this.redMoon = this.add.circle(1000, 150, 60, 0x8b0000, 0.6);
        this.redMoon.setAlpha(0);
        this.redMoon.setDepth(1);
        
        // Clouds covering moon
        this.clouds = this.add.graphics();
        this.clouds.fillStyle(0x1a1a2e, 0.8);
        this.clouds.fillCircle(1000, 150, 70);
        this.clouds.setAlpha(0);
        this.clouds.setDepth(2);
        
        // Traditional houses silhouettes
        this.createHouseSilhouettes();
        
        // Bamboo fence
        this.createBambooFence();
        
        // Fog particles
        this.fogParticles = this.add.particles(0, 0, 'smoke', {
            x: { min: -50, max: 1330 },
            y: { min: 500, max: 600 },
            speedX: { min: 10, max: 30 },
            speedY: { min: -5, max: 5 },
            scale: { start: 1, end: 1.5 },
            alpha: { start: 0.15, end: 0 },
            lifespan: 8000,
            frequency: 500,
            tint: 0x4a4a6a
        });
        this.fogParticles.stop();
        
        // Oil lamps (flickering)
        this.oilLamps = [];
        [200, 500, 800, 1100].forEach(x => {
            const lamp = this.add.circle(x, 480, 5, 0xffaa44, 0.8);
            lamp.setAlpha(0);
            this.oilLamps.push(lamp);
        });
        
        // Arka's house interior
        this.arkaHouseBackground = this.add.rectangle(640, 360, 1280, 720, 0x2a1810);
        this.arkaHouseBackground.setAlpha(0);
        
        // Wooden walls texture (dark brown)
        this.woodenWalls = this.add.graphics();
        this.woodenWalls.fillStyle(0x3a2010, 1);
        this.woodenWalls.fillRect(0, 0, 1280, 720);
        this.woodenWalls.setAlpha(0);
        
        // Bamboo texture lines
        for (let i = 0; i < 15; i++) {
            const line = this.add.line(0, 0, 100 + i * 80, 0, 100 + i * 80, 720, 0x2a1810, 0.5);
            line.setOrigin(0);
            line.setAlpha(0);
            line.setDepth(5);
        }
        
        // Keris near bedside
        this.keris = this.add.rectangle(400, 500, 5, 50, 0xcccccc);
        this.keris.setAlpha(0);
        this.keris.setDepth(10);
        
        // Lantern light (warm orange glow)
        this.lanternGlow = this.add.circle(300, 250, 120, 0xff6600, 0.2);
        this.lanternGlow.setAlpha(0);
        this.lanternGlow.setDepth(8);
        
        // Arka sleeping sprite
        this.arkaSleeping = this.add.rectangle(640, 520, 70, 100, 0x4a3020);
        this.arkaSleeping.setAlpha(0);
        this.arkaSleeping.setDepth(10);
        
        // Burning village elements
        this.createBurningVillageElements();
        
        // Shadow creatures (background)
        this.shadowCreatures = [];
        for (let i = 0; i < 3; i++) {
            const creature = this.add.rectangle(300 + i * 300, 450, 50, 100, 0x000000, 0.6);
            creature.setAlpha(0);
            this.shadowCreatures.push(creature);
        }
        
        // Green cursed aura
        this.cursedAura = this.add.circle(640, 360, 400, 0x00ff00, 0.1);
        this.cursedAura.setAlpha(0);
        this.cursedAura.setBlendMode(Phaser.BlendModes.ADD);
        
        // Bathara Kala silhouette
        this.bossGiantSilhouette = this.add.rectangle(640, 250, 200, 320, 0x000000, 0.95);
        this.bossGiantSilhouette.setAlpha(0);
        this.bossGiantSilhouette.setScale(1.5);
        
        // Glowing green eyes
        this.bossLeftEye = this.add.circle(600, 230, 12, 0x00ff00, 1);
        this.bossLeftEye.setAlpha(0);
        this.bossLeftEye.setDepth(100);
        
        this.bossRightEye = this.add.circle(680, 230, 12, 0x00ff00, 1);
        this.bossRightEye.setAlpha(0);
        this.bossRightEye.setDepth(100);
        
        // Dialogue system
        this.createDialogueSystem();
        
        // Tutorial text
        this.tutorialText = this.add.text(640, 620, '', {
            fontSize: '20px',
            fill: '#ffaa00',
            fontFamily: 'Courier New',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.tutorialText.setAlpha(0);
        this.tutorialText.setDepth(50);
        
        // Boss introduction text
        this.bossIntroText = this.add.text(640, 360, '', {
            fontSize: '64px',
            fill: '#ff0000',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5);
        this.bossIntroText.setAlpha(0);
        this.bossIntroText.setDepth(200);
        
        this.bossSubtitleText = this.add.text(640, 440, '', {
            fontSize: '24px',
            fill: '#ffaa00',
            fontFamily: 'Arial',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        this.bossSubtitleText.setAlpha(0);
        this.bossSubtitleText.setDepth(200);
        
        // Skip hint
        this.skipHint = this.add.text(640, 690, '[ESC] Skip Cutscene', {
            fontSize: '16px',
            fill: '#666666',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        this.skipHint.setAlpha(0);
        this.skipHint.setDepth(200);
    }

    createHouseSilhouettes() {
        // Traditional Javanese house silhouettes
        const housePositions = [
            { x: 250, y: 500, w: 150, h: 120 },
            { x: 640, y: 480, w: 180, h: 140 },
            { x: 1000, y: 500, w: 140, h: 110 }
        ];
        
        this.houses = [];
        housePositions.forEach(pos => {
            const house = this.add.rectangle(pos.x, pos.y, pos.w, pos.h, 0x1a1a1a);
            house.setAlpha(0);
            
            // Roof (traditional shape)
            const roof = this.add.triangle(
                pos.x, pos.y - pos.h/2 - 25,
                0, 50,
                pos.w/2 + 25, 0,
                -pos.w/2 - 25, 0,
                0x0a0a0a
            );
            roof.setAlpha(0);
            
            this.houses.push(house, roof);
        });
    }

    createBambooFence() {
        this.bambooFence = this.add.graphics();
        this.bambooFence.lineStyle(2, 0x3a3a2a, 1);
        
        // Horizontal lines
        this.bambooFence.lineBetween(0, 580, 1280, 580);
        this.bambooFence.lineBetween(0, 590, 1280, 590);
        
        // Vertical bamboo poles
        for (let x = 0; x < 1280; x += 50) {
            this.bambooFence.lineBetween(x, 575, x, 595);
        }
        
        this.bambooFence.setAlpha(0);
    }

    createBurningVillageElements() {
        // Fire particles for burning houses
        this.fireParticles = this.add.particles(0, 0, 'ember', {
            x: { min: 0, max: 1280 },
            y: { min: 450, max: 550 },
            speedY: { min: -150, max: -250 },
            speedX: { min: -40, max: 40 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 2000,
            frequency: 20,
            tint: [0xff3300, 0xff6600, 0xff9900],
            blendMode: 'ADD'
        });
        this.fireParticles.stop();
        
        // Dark smoke
        this.darkSmoke = this.add.particles(0, 0, 'smoke', {
            x: { min: 0, max: 1280 },
            y: 600,
            speedY: { min: -80, max: -150 },
            speedX: { min: -30, max: 30 },
            scale: { start: 0.8, end: 2 },
            alpha: { start: 0.7, end: 0 },
            lifespan: 5000,
            frequency: 150,
            tint: 0x1a1a1a
        });
        this.darkSmoke.stop();
        
        // Flying ash particles
        this.ashParticles = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 1280 },
            y: 720,
            speedY: { min: -50, max: -100 },
            speedX: { min: -20, max: 20 },
            scale: { start: 0.05, end: 0.02 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 4000,
            frequency: 80,
            tint: 0x888888
        });
        this.ashParticles.stop();
    }

    createDialogueSystem() {
        // Dialogue box (dark semi-transparent)
        this.dialogueBox = this.add.rectangle(640, 620, 1000, 160, 0x000000, 0.85);
        this.dialogueBox.setStrokeStyle(3, 0x8b4513);
        this.dialogueBox.setVisible(false);
        this.dialogueBox.setDepth(100);
        
        // Character name label
        this.characterNameBox = this.add.rectangle(180, 555, 220, 40, 0x8b4513, 1);
        this.characterNameBox.setVisible(false);
        this.characterNameBox.setDepth(101);
        
        this.characterNameText = this.add.text(180, 555, '', {
            fontSize: '20px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.characterNameText.setVisible(false);
        this.characterNameText.setDepth(102);
        
        // Dialogue text
        this.dialogueText = this.add.text(150, 580, '', {
            fontSize: '22px',
            fill: '#ffffff',
            fontFamily: 'Courier New',
            wordWrap: { width: 950 },
            lineSpacing: 10
        });
        this.dialogueText.setVisible(false);
        this.dialogueText.setDepth(101);
        
        // Character portrait placeholder
        this.portrait = this.add.rectangle(80, 620, 80, 80, 0x4a3020);
        this.portrait.setStrokeStyle(3, 0x8b4513);
        this.portrait.setVisible(false);
        this.portrait.setDepth(101);
    }

    createAudio() {
        // Placeholder for audio - will use existing sounds
        this.ambientWind = null; // Add wind sound later
        this.villageScreams = null; // Add scream sounds later
        this.dramaticMusic = null; // Add dramatic music later
    }

    startCutscene() {
        this.canSkip = true;
        
        // Show skip hint
        this.tweens.add({
            targets: this.skipHint,
            alpha: 0.4,
            duration: 1500
        });
        
        // Immediately start with opening text (skip the 5 second darkness)
        this.showOpeningText();
    }

    playEerieAmbience() {
        // Play ambient wind sound (placeholder)
        // Subtle screen pulse for eerie effect
        this.tweens.add({
            targets: this.blackOverlay,
            alpha: { from: 1, to: 0.95 },
            duration: 3000,
            yoyo: true,
            repeat: 2
        });
    }

    showOpeningText() {
        // Fade out black overlay first
        this.tweens.add({
            targets: this.blackOverlay,
            alpha: 0.3,
            duration: 2000
        });
        
        const texts = [
            'Desa Kertaraga...',
            'Tanah yang hidup damai...',
            '...hingga malam kutukan itu tiba.'
        ];
        
        let delay = 1000;
        texts.forEach((text, index) => {
            this.time.delayedCall(delay, () => {
                const textObj = this.add.text(0, index * 60 - 60, '', {
                    fontSize: '28px',
                    fill: '#aa8866',
                    fontFamily: 'Courier New',
                    align: 'center',
                    stroke: '#000000',
                    strokeThickness: 3
                }).setOrigin(0.5);
                
                this.openingTextContainer.add(textObj);
                
                // Typewriter effect
                this.typewriterEffect(textObj, text, 80);
            });
            delay += 3500;
        });
        
        // Fade in container
        this.tweens.add({
            targets: this.openingTextContainer,
            alpha: 1,
            duration: 1500
        });
        
        // After all texts, fade out and show village
        this.time.delayedCall(12000, () => {
            this.tweens.add({
                targets: this.openingTextContainer,
                alpha: 0,
                duration: 2000,
                onComplete: () => {
                    this.showVillageScene();
                }
            });
        });
    }

    typewriterEffect(textObj, fullText, speed) {
        let charIndex = 0;
        const timer = this.time.addEvent({
            delay: speed,
            callback: () => {
                if (charIndex < fullText.length) {
                    textObj.setText(textObj.text + fullText[charIndex]);
                    if (this.sound.get('hit')) {
                        this.sound.play('hit', { volume: 0.03, rate: 2 });
                    }
                    charIndex++;
                } else {
                    timer.remove();
                }
            },
            loop: true
        });
    }

    showVillageScene() {
        // Fade out black overlay completely
        this.tweens.add({
            targets: this.blackOverlay,
            alpha: 0,
            duration: 2000
        });
        
        // Show cinematic bars
        this.showCinematicBars();
        
        // Fade in village background
        this.tweens.add({
            targets: [this.villageBackground, this.redMoon, this.clouds, this.bambooFence],
            alpha: 1,
            duration: 3000
        });
        
        // Fade in houses
        if (this.houses && this.houses.length > 0) {
            this.houses.forEach((house, index) => {
                this.tweens.add({
                    targets: house,
                    alpha: 0.9,
                    duration: 3000,
                    delay: index * 200
                });
            });
        }
        
        // Start fog
        this.fogParticles.start();
        
        // Flicker oil lamps
        this.oilLamps.forEach((lamp, index) => {
            this.tweens.add({
                targets: lamp,
                alpha: { from: 0, to: 0.8 },
                duration: 2000,
                delay: index * 300
            });
            
            // Continuous flicker
            this.time.delayedCall(2000 + index * 300, () => {
                this.tweens.add({
                    targets: lamp,
                    alpha: { from: 0.6, to: 0.9 },
                    duration: 800,
                    yoyo: true,
                    repeat: -1
                });
            });
        });
        
        // Sway trees effect (simulate with slight camera movement)
        this.tweens.add({
            targets: this.cameras.main,
            scrollX: { from: -2, to: 2 },
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Wait then transition to Arka's house
        this.time.delayedCall(5000, () => {
            this.transitionToArkaHouse();
        });
    }

    transitionToArkaHouse() {
        // Fade out village
        this.tweens.add({
            targets: [this.villageBackground, this.redMoon, this.clouds, this.bambooFence, ...this.houses, ...this.oilLamps],
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.fogParticles.stop();
                this.showArkaHouseInterior();
            }
        });
    }

    showArkaHouseInterior() {
        // Show house interior
        this.tweens.add({
            targets: [this.arkaHouseBackground, this.woodenWalls, this.keris, this.lanternGlow, this.arkaSleeping],
            alpha: 1,
            duration: 2500
        });
        
        // Flicker lantern
        this.tweens.add({
            targets: this.lanternGlow,
            alpha: { from: 0.15, to: 0.25 },
            scale: { from: 0.95, to: 1.05 },
            duration: 1200,
            yoyo: true,
            repeat: -1
        });
        
        // Breathing animation for sleeping Arka
        this.tweens.add({
            targets: this.arkaSleeping,
            scaleY: { from: 1, to: 1.02 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Wait 4 seconds then ATTACK!
        this.time.delayedCall(4000, () => {
            this.triggerVillageAttack();
        });
    }

    triggerVillageAttack() {
        // LOUD SCREAMS AND EXPLOSIONS
        this.sound.play('boss', { volume: 1, rate: 0.7 });
        
        // Violent lantern flicker
        this.tweens.add({
            targets: this.lanternGlow,
            alpha: { from: 0.3, to: 0 },
            duration: 100,
            yoyo: true,
            repeat: 5
        });
        
        // Camera shake
        this.cameras.main.shake(800, 0.025);
        
        // Red flash
        const redFlash = this.add.rectangle(400, 300, 800, 600, 0xff0000, 0.6);
        redFlash.setDepth(500);
        this.tweens.add({
            targets: redFlash,
            alpha: 0,
            duration: 400,
            onComplete: () => redFlash.destroy()
        });
        
        // Arka wakes up shocked
        this.time.delayedCall(600, () => {
            this.arkaWakesUp();
        });
    }

    arkaWakesUp() {
        // Arka sits up quickly
        this.tweens.add({
            targets: this.arkaSleeping,
            y: 480,
            scaleY: 1.1,
            duration: 150,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Reset breathing animation
                this.tweens.killTweensOf(this.arkaSleeping);
            }
        });
        
        // Show dialogue
        this.time.delayedCall(800, () => {
            this.showDialogue('ARKA', '...Apa itu...?');
            
            this.time.delayedCall(2500, () => {
                this.hideDialogue();
                
                // Villager screaming outside
                this.time.delayedCall(500, () => {
                    this.showDialogue('PENDUDUK', 'LARI!! BATHARA KALA DATANG!!');
                    this.sound.play('boss', { volume: 0.6, rate: 1.2 });
                    
                    this.time.delayedCall(3000, () => {
                        this.hideDialogue();
                        this.arkaGrabsKeris();
                    });
                });
            });
        });
    }

    arkaGrabsKeris() {
        // Arka grabs keris
        this.tweens.add({
            targets: this.keris,
            x: 620,
            y: 490,
            angle: -45,
            duration: 300,
            ease: 'Power2'
        });
        
        // Transition to burning village
        this.time.delayedCall(1000, () => {
            this.transitionToBurningVillage();
        });
    }

    transitionToBurningVillage() {
        // Fade out house interior
        this.tweens.add({
            targets: [this.arkaHouseBackground, this.woodenWalls, this.lanternGlow, this.arkaSleeping, this.keris],
            alpha: 0,
            duration: 1500,
            onComplete: () => {
                this.showBurningVillage();
            }
        });
    }

    showBurningVillage() {
        // Dark red/orange background
        const burningBg = this.add.rectangle(640, 360, 1280, 720, 0x4a1a0a);
        burningBg.setAlpha(0);
        
        this.tweens.add({
            targets: burningBg,
            alpha: 1,
            duration: 2000
        });
        
        // Start fire, smoke, and ash particles
        this.fireParticles.start();
        this.darkSmoke.start();
        this.ashParticles.start();
        
        // Show cursed green aura
        this.tweens.add({
            targets: this.cursedAura,
            alpha: 0.15,
            scale: { from: 0.8, to: 1.2 },
            duration: 3000,
            yoyo: true,
            repeat: -1
        });
        
        // Show shadow creatures moving
        this.shadowCreatures.forEach((creature, index) => {
            this.tweens.add({
                targets: creature,
                alpha: 0.7,
                duration: 1000,
                delay: index * 400
            });
            
            // Move creatures
            this.tweens.add({
                targets: creature,
                x: creature.x + (index % 2 === 0 ? 150 : -150),
                duration: 3000,
                delay: index * 400,
                yoyo: true,
                repeat: -1
            });
        });
        
        // Show tutorial
        this.tutorialText.setText('[A] [D] MOVE    [SPACE] JUMP    [J] ATTACK    [F] SPECIAL\n[ESC] PAUSE');
        this.tweens.add({
            targets: this.tutorialText,
            alpha: 1,
            duration: 1500
        });
        
        // Bathara Kala dialogue
        this.time.delayedCall(3000, () => {
            this.showDialogue('BATHARA KALA', 'MANUSIA...');
            this.sound.play('boss', { volume: 0.8, rate: 0.5 });
            
            this.time.delayedCall(3000, () => {
                this.showDialogue('BATHARA KALA', 'DESA INI AKAN LENYAP.');
                
                this.time.delayedCall(3500, () => {
                    this.hideDialogue();
                    this.showBatharaKalaAppearance();
                });
            });
        });
    }

    showBatharaKalaAppearance() {
        // Screen darkens
        const darkOverlay = this.add.rectangle(640, 360, 1280, 720, 0x000000, 0);
        darkOverlay.setDepth(80);
        
        this.tweens.add({
            targets: darkOverlay,
            alpha: 0.6,
            duration: 2000
        });
        
        // Red moon glows brighter
        this.redMoon.setAlpha(1);
        this.redMoon.setDepth(85);
        this.tweens.add({
            targets: this.redMoon,
            scale: { from: 1, to: 1.3 },
            alpha: { from: 0.6, to: 0.9 },
            duration: 2000
        });
        
        // Giant silhouette appears
        this.time.delayedCall(1500, () => {
            this.bossGiantSilhouette.setAlpha(1);
            this.bossGiantSilhouette.setDepth(90);
            
            // Eyes open
            this.time.delayedCall(800, () => {
                this.bossLeftEye.setAlpha(1);
                this.bossRightEye.setAlpha(1);
                
                // Pulse eyes
                this.tweens.add({
                    targets: [this.bossLeftEye, this.bossRightEye],
                    alpha: { from: 0.7, to: 1 },
                    scale: { from: 0.9, to: 1.3 },
                    duration: 1000,
                    yoyo: true,
                    repeat: -1
                });
                
                // Deep roar
                this.sound.play('boss', { volume: 1, rate: 0.4 });
                
                // Massive camera shake
                this.cameras.main.shake(1000, 0.04);
                
                // Wind explosion effect
                const windExplosion = this.add.circle(640, 250, 60, 0x00ff00, 0.3);
                windExplosion.setDepth(95);
                windExplosion.setBlendMode(Phaser.BlendModes.ADD);
                
                this.tweens.add({
                    targets: windExplosion,
                    scale: 18,
                    alpha: 0,
                    duration: 1500,
                    ease: 'Power2',
                    onComplete: () => windExplosion.destroy()
                });
                
                // Show boss introduction text
                this.time.delayedCall(1500, () => {
                    this.showBossIntroduction();
                });
            });
        });
    }

    showBossIntroduction() {
        this.bossIntroText.setText('BATHARA KALA');
        this.bossSubtitleText.setText('THE DEVOURER OF SOULS');
        
        this.tweens.add({
            targets: this.bossIntroText,
            alpha: 1,
            scale: { from: 0.5, to: 1 },
            duration: 1500,
            ease: 'Back.easeOut'
        });
        
        this.time.delayedCall(500, () => {
            this.tweens.add({
                targets: this.bossSubtitleText,
                alpha: 1,
                duration: 1000
            });
        });
        
        // Lightning flashes
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const lightning = this.add.rectangle(640, 360, 1280, 720, 0xffffff, 0.4);
                lightning.setDepth(150);
                this.sound.play('boss', { volume: 0.4, rate: 0.6 });
                this.tweens.add({
                    targets: lightning,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => lightning.destroy()
                });
            },
            repeat: 2
        });
        
        // Wait then start game
        this.time.delayedCall(5000, () => {
            this.startGame();
        });
    }

    showDialogue(character, text) {
        this.dialogueBox.setVisible(true);
        this.dialogueText.setVisible(true);
        this.portrait.setVisible(true);
        this.characterNameBox.setVisible(true);
        this.characterNameText.setVisible(true);
        
        // Set character name
        this.characterNameText.setText(character);
        
        // Change portrait color based on character
        if (character === 'ARKA') {
            this.portrait.setFillStyle(0x4a3020);
        } else if (character === 'BATHARA KALA') {
            this.portrait.setFillStyle(0x000000);
            this.portrait.setStrokeStyle(3, 0x00ff00);
        } else if (character === 'PENDUDUK') {
            this.portrait.setFillStyle(0x6a5040);
        }
        
        // Type writer effect
        this.dialogueText.setText('');
        let charIndex = 0;
        
        const typeTimer = this.time.addEvent({
            delay: 60,
            callback: () => {
                if (charIndex < text.length) {
                    this.dialogueText.setText(this.dialogueText.text + text[charIndex]);
                    // Play typing sound
                    this.sound.play('hit', { volume: 0.08, rate: 1.8 });
                    charIndex++;
                } else {
                    typeTimer.remove();
                }
            },
            loop: true
        });
    }

    hideDialogue() {
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
        this.portrait.setVisible(false);
        this.characterNameBox.setVisible(false);
        this.characterNameText.setVisible(false);
    }

    createAudio() {
        // Placeholder for audio - will use existing sounds
        // TODO: Add gamelan ambience, jungle sounds, whispers, etc.
    }

    startGame() {
        // Prevent multiple calls
        if (this.isSkipping) return;
        this.isSkipping = true;
        
        // Hide tutorial
        this.tweens.add({
            targets: this.tutorialText,
            alpha: 0,
            duration: 1000
        });
        
        // Remove ESC key listener
        if (this.escKey) {
            this.escKey.off('down');
            this.escKey.destroy();
        }
        
        // Fade to black using camera
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            // Stop all particles
            if (this.fireParticles) this.fireParticles.stop();
            if (this.darkSmoke) this.darkSmoke.stop();
            if (this.ashParticles) this.ashParticles.stop();
            if (this.fogParticles) this.fogParticles.stop();
            
            // Stop camera effects
            this.cameras.main.stopFollow();
            this.cameras.main.setScroll(0, 0);
            
            // Start battle scene
            this.scene.start('BattleScene');
        });
    }

    skipToGame() {
        // Prevent multiple calls
        if (this.isSkipping) return;
        this.isSkipping = true;
        
        // Stop all tweens and timers
        this.tweens.killAll();
        this.time.removeAllEvents();
        
        // Stop all particles
        if (this.fireParticles) this.fireParticles.stop();
        if (this.darkSmoke) this.darkSmoke.stop();
        if (this.ashParticles) this.ashParticles.stop();
        if (this.fogParticles) this.fogParticles.stop();
        
        // Stop camera effects
        this.cameras.main.stopFollow();
        this.cameras.main.setScroll(0, 0);
        
        // Remove ESC key listener to prevent double trigger
        if (this.escKey) {
            this.escKey.off('down');
            this.escKey.destroy();
        }
        
        // Fade to black quickly
        this.cameras.main.fadeOut(500, 0, 0, 0);
        
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('BattleScene');
        });
    }
}
