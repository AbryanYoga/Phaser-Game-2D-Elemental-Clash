const fs = require('fs');
const path = require('path');

const SOUNDS_DIR = path.join(__dirname, '../assets/sounds');

// Ensure directory exists
if (!fs.existsSync(SOUNDS_DIR)) {
    fs.mkdirSync(SOUNDS_DIR, { recursive: true });
}

// WAV File Writer Helper (Mono, 16-bit PCM, 44100Hz)
function writeWav(filePath, samples, sampleRate = 44100) {
    const buffer = Buffer.alloc(44 + samples.length * 2);
    
    // RIFF identifier
    buffer.write('RIFF', 0);
    // file length minus 8
    buffer.writeUInt32LE(36 + samples.length * 2, 4);
    // RIFF type
    buffer.write('WAVE', 8);
    // format chunk identifier
    buffer.write('fmt ', 12);
    // format chunk length
    buffer.writeUInt32LE(16, 16);
    // sample format (raw PCM = 1)
    buffer.writeUInt16LE(1, 20);
    // channel count (1 = mono)
    buffer.writeUInt16LE(1, 22);
    // sample rate
    buffer.writeUInt32LE(sampleRate, 24);
    // byte rate = sampleRate * channels * bytesPerSample
    buffer.writeUInt32LE(sampleRate * 2, 28);
    // block align = channels * bytesPerSample
    buffer.writeUInt16LE(2, 32);
    // bits per sample (16)
    buffer.writeUInt16LE(16, 34);
    // data chunk identifier
    buffer.write('data', 36);
    // data chunk length
    buffer.writeUInt32LE(samples.length * 2, 40);
    
    // Write samples
    for (let i = 0; i < samples.length; i++) {
        let val = Math.round(samples[i] * 32767);
        // Clip values
        val = Math.max(-32768, Math.min(32767, val));
        buffer.writeInt16LE(val, 44 + i * 2);
    }
    
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved sound: ${path.basename(filePath)} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// --- SOUND EFFECTS GENERATORS ---

// 1. Generic Attack
function generateAttack() {
    const duration = 0.15;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 1200 - 1000 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const env = Math.exp(-p * 12);
        samples[i] = wave * env * 0.5;
    }
    return samples;
}

// 2. Generic Hit
function generateHit() {
    const duration = 0.15;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 400 - 300 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 15);
        samples[i] = (wave * 0.5 + noise * 0.5) * env * 0.6;
    }
    return samples;
}

// 3. Generic Jump
function generateJump() {
    const duration = 0.18;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 150 + 800 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const env = Math.exp(-p * 6);
        samples[i] = wave * env * 0.4;
    }
    return samples;
}

// 4. Boss Intro Announcement (FIGHT!)
function generateBoss() {
    const duration = 0.8;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 300 + 400 * Math.sin(p * Math.PI);
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = (Math.sin(phase) >= 0 ? 0.3 : -0.3) + Math.sin(phase * 0.5) * 0.2;
        const env = Math.sin(p * Math.PI) * (1 - p * 0.5);
        samples[i] = wave * env * 0.5;
    }
    return samples;
}

// --- GALE (Wind Element) ---
function generateGaleAttack() {
    const duration = 0.25;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 1600 - 1300 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.sin(p * Math.PI) * (1 - p);
        samples[i] = (wave * 0.2 + noise * 0.8) * env * 0.5;
    }
    return samples;
}

function generateGaleJump() {
    const duration = 0.2;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 300 + 1000 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.sin(p * Math.PI);
        samples[i] = (wave * 0.3 + noise * 0.7) * env * 0.4;
    }
    return samples;
}

function generateGaleHurt() {
    const duration = 0.2;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 500 - 300 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 15);
        samples[i] = (wave * 0.4 + noise * 0.6) * env * 0.6;
    }
    return samples;
}

function generateGaleDead() {
    const duration = 0.8;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 600 - 450 * p + Math.sin((i/sampleRate) * 15) * 50;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = (1 - p) * (1 - p);
        samples[i] = (wave * 0.2 + noise * 0.8) * env * 0.4;
    }
    return samples;
}

// --- HOMURA (Fire Element) ---
function generateHomuraAttack() {
    const duration = 0.3;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 800 - 700 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase) + (Math.sin(phase * 0.5) * 0.5);
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 10);
        samples[i] = (wave * 0.4 + noise * 0.6) * env * 0.6;
    }
    return samples;
}

function generateHomuraJump() {
    const duration = 0.25;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 100 + 400 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.sin(p * Math.PI) * (1 - p * 0.5);
        samples[i] = (wave * 0.3 + noise * 0.7) * env * 0.5;
    }
    return samples;
}

function generateHomuraHurt() {
    const duration = 0.25;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 900 - 500 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        let noise = Math.random() * 2 - 1;
        if (Math.random() < 0.2) noise = 0; // crackle
        const env = Math.exp(-p * 12);
        samples[i] = (wave * 0.3 + noise * 0.7) * env * 0.6;
    }
    return samples;
}

function generateHomuraDead() {
    const duration = 0.9;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 300 - 250 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const flicker = 0.7 + 0.3 * Math.sin((i/sampleRate) * 40);
        const env = (1 - p) * (1 - p) * flicker;
        samples[i] = (wave * 0.3 + noise * 0.7) * env * 0.5;
    }
    return samples;
}

// --- SYLVAN (Nature/Wood/Leaf Element) ---
function generateSylvanAttack() {
    const duration = 0.2;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 2000 - 1500 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 20);
        samples[i] = (wave * 0.2 + noise * 0.8) * env * 0.6;
    }
    return samples;
}

function generateSylvanJump() {
    const duration = 0.2;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 600 + 400 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.sin(p * Math.PI);
        samples[i] = (wave * 0.5 + noise * 0.5) * env * 0.4;
    }
    return samples;
}

function generateSylvanHurt() {
    const duration = 0.2;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 400 - 200 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase) + 0.3 * Math.sin(phase * 3);
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 18);
        samples[i] = (wave * 0.7 + noise * 0.3) * env * 0.6;
    }
    return samples;
}

function generateSylvanDead() {
    const duration = 0.8;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 500 - 400 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = (1 - p) * (1 - p);
        samples[i] = (wave * 0.3 + noise * 0.7) * env * 0.4;
    }
    return samples;
}

// --- TERRA (Earth/Rock Element) ---
function generateTerraAttack() {
    const duration = 0.35;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 300 - 250 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase) >= 0 ? 0.5 : -0.5;
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 8);
        samples[i] = (wave * 0.6 + noise * 0.4) * env * 0.6;
    }
    return samples;
}

function generateTerraJump() {
    const duration = 0.25;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 120 + 300 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = Math.sin(p * Math.PI) * (1 - p * 0.3);
        samples[i] = (wave * 0.5 + noise * 0.5) * env * 0.5;
    }
    return samples;
}

function generateTerraHurt() {
    const duration = 0.25;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 200 - 150 * p;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase) >= 0 ? 0.6 : -0.6;
        const noise = Math.random() * 2 - 1;
        const env = Math.exp(-p * 14);
        samples[i] = (wave * 0.7 + noise * 0.3) * env * 0.7;
    }
    return samples;
}

function generateTerraDead() {
    const duration = 1.0;
    const sampleRate = 44100;
    const totalSamples = duration * sampleRate;
    const samples = new Float32Array(totalSamples);
    let phase = 0;
    for (let i = 0; i < totalSamples; i++) {
        const p = i / totalSamples;
        const freq = 80 + Math.sin((i/sampleRate) * 30) * 30;
        phase += (2 * Math.PI * freq) / sampleRate;
        const wave = Math.sin(phase);
        const noise = Math.random() * 2 - 1;
        const env = (1 - p) * (1 - p);
        samples[i] = (wave * 0.5 + noise * 0.5) * env * 0.6;
    }
    return samples;
}

// --- BGM (Retro 8-Bit Chiptune Track) ---
function generateBgm() {
    const durationSec = 12.0; // 12 seconds loop
    const sampleRate = 44100;
    const totalSamples = durationSec * sampleRate;
    const samples = new Float32Array(totalSamples);
    
    const bpm = 120;
    const stepDuration = 60 / bpm / 4; // 16th note (125ms)
    
    // Retro chord progression/melody loop in C minor / pentatonic scale
    const melody = [
        60, 63, 65, 67, 70, 67, 65, 63,
        62, 65, 67, 70, 72, 70, 67, 65,
        63, 67, 70, 72, 75, 72, 70, 67,
        67, 65, 63, 60, 58, 60, 63, 65,
        
        60, 63, 65, 67, 70, 67, 65, 63,
        62, 65, 67, 70, 72, 70, 67, 65,
        63, 67, 70, 72, 75, 72, 70, 67,
        72, 75, 77, 79, 82, 79, 77, 75
    ];
    
    const bass = [
        36, 36, 36, 36, 36, 36, 36, 36,
        38, 38, 38, 38, 38, 38, 38, 38,
        39, 39, 39, 39, 39, 39, 39, 39,
        34, 34, 34, 34, 35, 35, 35, 35,
        
        36, 36, 36, 36, 36, 36, 36, 36,
        38, 38, 38, 38, 38, 38, 38, 38,
        39, 39, 39, 39, 39, 39, 39, 39,
        43, 43, 43, 43, 43, 43, 43, 43
    ];

    let melodyPhase = 0;
    let bassPhase = 0;
    
    for (let i = 0; i < totalSamples; i++) {
        const time = i / sampleRate;
        const totalSteps = melody.length;
        const step = Math.floor(time / stepDuration) % totalSteps;
        const stepTime = time % stepDuration;
        
        // --- Melody Channel (Pulse/Square Wave) ---
        let melodyVal = 0;
        const mNote = melody[step];
        if (mNote > 0) {
            const mFreq = 440 * Math.pow(2, (mNote - 69) / 12);
            melodyPhase += (2 * Math.PI * mFreq) / sampleRate;
            // Pulse wave (25% duty cycle)
            let osc = (melodyPhase % (2 * Math.PI)) < (Math.PI * 0.5) ? 0.25 : -0.25;
            const env = Math.exp(-stepTime * 12);
            melodyVal = osc * env;
        }
        
        // --- Bass Channel (Triangle Wave) ---
        let bassVal = 0;
        const bNote = bass[step];
        if (bNote > 0) {
            const bFreq = 440 * Math.pow(2, (bNote - 69) / 12);
            bassPhase += (2 * Math.PI * bFreq) / sampleRate;
            let osc = (2 / Math.PI) * Math.asin(Math.sin(bassPhase));
            const env = Math.exp(-stepTime * 6);
            bassVal = osc * 0.35 * env;
        }
        
        // --- Noise Percussion (Snare & Hi-Hat) ---
        let noiseVal = 0;
        const isSnare = (step % 8 === 4);
        const isHihat = (step % 2 === 1) && !isSnare;
        
        if (isSnare) {
            const env = Math.exp(-stepTime * 20);
            noiseVal = (Math.random() * 2 - 1) * 0.15 * env;
        } else if (isHihat) {
            const env = Math.exp(-stepTime * 60);
            noiseVal = (Math.random() * 2 - 1) * 0.06 * env;
        }
        
        // Mix and master compression/ceiling
        let mixed = (melodyVal + bassVal + noiseVal) * 0.45;
        samples[i] = mixed;
    }
    
    return samples;
}

// --- EXECUTE WRITING ALL SOUNDS ---

console.log('Starting programmatic audio synthesis...');

// Common SFX
writeWav(path.join(SOUNDS_DIR, 'attack.wav'), generateAttack());
writeWav(path.join(SOUNDS_DIR, 'hit.wav'), generateHit());
writeWav(path.join(SOUNDS_DIR, 'jump.wav'), generateJump());
writeWav(path.join(SOUNDS_DIR, 'boss.wav'), generateBoss());

// Character Elemental SFX
const elements = {
    gale: { attack: generateGaleAttack, jump: generateGaleJump, hurt: generateGaleHurt, dead: generateGaleDead },
    homura: { attack: generateHomuraAttack, jump: generateHomuraJump, hurt: generateHomuraHurt, dead: generateHomuraDead },
    sylvan: { attack: generateSylvanAttack, jump: generateSylvanJump, hurt: generateSylvanHurt, dead: generateSylvanDead },
    terra: { attack: generateTerraAttack, jump: generateTerraJump, hurt: generateTerraHurt, dead: generateTerraDead }
};

for (const [char, actions] of Object.entries(elements)) {
    for (const [action, genFunc] of Object.entries(actions)) {
        const filePath = path.join(SOUNDS_DIR, `${char}_${action}.wav`);
        writeWav(filePath, genFunc());
    }
}

// BGM
writeWav(path.join(SOUNDS_DIR, 'bgm.wav'), generateBgm());

console.log('Audio synthesis completed successfully without error!');
