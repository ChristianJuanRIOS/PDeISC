// ============================================
// SISTEMA DE AUDIO - MÚSICA AMBIENTAL
// ============================================

let audioContext = null;
let isMusicPlaying = false;
let currentVolume = 0.5;
let musicNodes = [];
let audioInitialized = false;

// Inicializar audio (se llama al hacer clic)
function initAudio() {
    if (audioInitialized) return;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        audioInitialized = true;
        console.log("✅ Audio inicializado correctamente");
    } catch(e) {
        console.log("❌ Error al inicializar audio:", e);
    }
}

function createForestAmbience() {
    if (!audioContext) return;
    
    try {
        const masterGain = audioContext.createGain();
        masterGain.gain.value = currentVolume * 0.4;
        masterGain.connect(audioContext.destination);
        musicNodes.push(masterGain);
        
        // Viento
        const windBufferSize = 4096;
        const windNoise = audioContext.createBufferSource();
        const windBuffer = audioContext.createBuffer(1, windBufferSize, audioContext.sampleRate);
        const windData = windBuffer.getChannelData(0);
        for (let i = 0; i < windBufferSize; i++) {
            windData[i] = (Math.random() * 2 - 1) * 0.5;
        }
        windNoise.buffer = windBuffer;
        windNoise.loop = true;
        const windFilter = audioContext.createBiquadFilter();
        windFilter.type = 'lowpass';
        windFilter.frequency.value = 400;
        const windGain = audioContext.createGain();
        windGain.gain.value = currentVolume * 0.15;
        windNoise.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(masterGain);
        windNoise.start();
        musicNodes.push(windNoise, windFilter, windGain);
        
        // Pájaros (solo si el sonido está activado)
        if (soundEnabled) {
            function addBirdSound(delay, frequency, duration) {
                setTimeout(() => {
                    if (!audioContext || masterGain.gain.value === 0 || !isMusicPlaying) return;
                    const birdOsc = audioContext.createOscillator();
                    const birdGain = audioContext.createGain();
                    birdOsc.type = 'sine';
                    birdOsc.frequency.value = frequency;
                    birdGain.gain.value = currentVolume * 0.08;
                    birdOsc.connect(birdGain);
                    birdGain.connect(masterGain);
                    birdOsc.start();
                    birdGain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);
                    birdOsc.stop(audioContext.currentTime + duration);
                    setTimeout(() => addBirdSound(3000 + Math.random() * 5000, 800 + Math.random() * 400, 1.5), 4000 + Math.random() * 8000);
                }, delay);
            }
            addBirdSound(1000, 880, 1.2);
            addBirdSound(3000, 1046.5, 1.5);
            addBirdSound(6000, 987.77, 1.3);
        }
        
        // Arroyo
        const waterNoise = audioContext.createBufferSource();
        const waterBuffer = audioContext.createBuffer(1, 2048, audioContext.sampleRate);
        const waterData = waterBuffer.getChannelData(0);
        for (let i = 0; i < 2048; i++) {
            waterData[i] = Math.sin(i * 0.05) * (Math.random() - 0.5) * 0.3;
        }
        waterNoise.buffer = waterBuffer;
        waterNoise.loop = true;
        const waterFilter = audioContext.createBiquadFilter();
        waterFilter.type = 'bandpass';
        waterFilter.frequency.value = 1200;
        const waterGain = audioContext.createGain();
        waterGain.gain.value = currentVolume * 0.1;
        waterNoise.connect(waterFilter);
        waterFilter.connect(waterGain);
        waterGain.connect(masterGain);
        waterNoise.start();
        musicNodes.push(waterNoise, waterFilter, waterGain);
        
        // Melodía
        const melodyNotes = [
            { note: 261.63, duration: 2.0, delay: 0 },
            { note: 293.66, duration: 1.5, delay: 2.5 },
            { note: 329.63, duration: 2.0, delay: 4.5 },
            { note: 349.23, duration: 1.5, delay: 7.0 },
            { note: 329.63, duration: 1.5, delay: 9.0 },
            { note: 293.66, duration: 2.0, delay: 11.0 },
            { note: 261.63, duration: 3.0, delay: 13.5 }
        ];
        
        function playMelody() {
            if (!audioContext || masterGain.gain.value === 0 || !isMusicPlaying) return;
            for (const m of melodyNotes) {
                setTimeout(() => {
                    if (!audioContext || !isMusicPlaying) return;
                    const osc = audioContext.createOscillator();
                    const melGain = audioContext.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = m.note;
                    melGain.gain.value = currentVolume * 0.12;
                    osc.connect(melGain);
                    melGain.connect(masterGain);
                    osc.start();
                    melGain.gain.setValueAtTime(0, audioContext.currentTime);
                    melGain.gain.linearRampToValueAtTime(currentVolume * 0.12, audioContext.currentTime + 0.1);
                    melGain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + m.duration);
                    osc.stop(audioContext.currentTime + m.duration);
                }, m.delay * 1000);
            }
            setTimeout(playMelody, 30000);
        }
        setTimeout(playMelody, 1000);
        
        // Latido del bosque
        function addHeartbeat() {
            if (!audioContext || masterGain.gain.value === 0 || !isMusicPlaying) return;
            const drumOsc = audioContext.createOscillator();
            const drumGain = audioContext.createGain();
            drumOsc.type = 'sine';
            drumOsc.frequency.value = 60;
            drumGain.gain.value = currentVolume * 0.04;
            drumOsc.connect(drumGain);
            drumGain.connect(masterGain);
            drumOsc.start();
            drumGain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.8);
            drumOsc.stop(audioContext.currentTime + 0.8);
            setTimeout(addHeartbeat, 6000);
        }
        setTimeout(addHeartbeat, 2000);
        
        // Grillos
        function addCricket() {
            if (!audioContext || masterGain.gain.value === 0 || !isMusicPlaying) return;
            const cricketOsc = audioContext.createOscillator();
            const cricketGain = audioContext.createGain();
            cricketOsc.type = 'sine';
            cricketOsc.frequency.value = 2000 + Math.random() * 500;
            cricketGain.gain.value = currentVolume * 0.03;
            cricketOsc.connect(cricketGain);
            cricketGain.connect(masterGain);
            cricketOsc.start();
            cricketGain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.6);
            cricketOsc.stop(audioContext.currentTime + 0.6);
            setTimeout(addCricket, 8000 + Math.random() * 5000);
        }
        setTimeout(addCricket, 5000);
        
        console.log("✅ Música ambiental creada");
    } catch(e) {
        console.log("❌ Error al crear música:", e);
    }
}

function startMenuMusic() {
    if (!audioContext) {
        initAudio();
    }
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("✅ Audio reanudado");
            if (!isMusicPlaying) {
                createForestAmbience();
                isMusicPlaying = true;
            }
        }).catch(e => console.log("❌ Error al reanudar audio:", e));
    } else if (!isMusicPlaying) {
        createForestAmbience();
        isMusicPlaying = true;
    }
}

function stopMenuMusic() {
    isMusicPlaying = false;
    // No destruir los nodos, solo detener la reproducción
}

function setMusicVolume(vol) {
    currentVolume = vol;
    if (musicNodes.length > 0) {
        const masterGain = musicNodes[0];
        if (masterGain && masterGain.gain) {
            masterGain.gain.value = vol * 0.4;
        }
    }
}

// Efectos de sonido
function playEatSound() {
    if (!audioContext || !soundEnabled || !isMusicPlaying) return;
    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = 523.25;
        gain.gain.value = currentVolume * 0.2;
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.2);
        osc.stop(audioContext.currentTime + 0.2);
        const osc2 = audioContext.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.value = 659.25;
        osc2.connect(gain);
        osc2.start();
        osc2.stop(audioContext.currentTime + 0.3);
    } catch(e) {
        console.log("Error al reproducir sonido de comida:", e);
    }
}

function playGameOverSound() {
    if (!audioContext || !soundEnabled || !isMusicPlaying) return;
    try {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.type = 'sawtooth';
                osc.frequency.value = 440 - i * 50;
                gain.gain.value = currentVolume * 0.15;
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.start();
                gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.5);
                osc.stop(audioContext.currentTime + 0.5);
            }, i * 150);
        }
    } catch(e) {
        console.log("Error al reproducir sonido de game over:", e);
    }
}

function playMenuSound() {
    if (!audioContext || !soundEnabled || !isMusicPlaying) return;
    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = currentVolume * 0.1;
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
        osc.stop(audioContext.currentTime + 0.1);
    } catch(e) {
        console.log("Error al reproducir sonido de menú:", e);
    }
}

function playSelectSound() {
    if (!audioContext || !soundEnabled || !isMusicPlaying) return;
    try {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.type = 'sine';
        osc.frequency.value = 523.25;
        gain.gain.value = currentVolume * 0.15;
        osc.connect(gain);
        gain.connect(audioContext.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.15);
        osc.stop(audioContext.currentTime + 0.15);
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.value = 659.25;
            osc2.connect(gain);
            osc2.start();
            osc2.stop(audioContext.currentTime + 0.25);
        }, 50);
    } catch(e) {
        console.log("Error al reproducir sonido de selección:", e);
    }
}