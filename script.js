document.addEventListener('DOMContentLoaded', () => {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const startButton = document.getElementById('startButton');
    const envelopeContainer = document.getElementById('envelopeContainer');
    const unfoldButton = document.getElementById('unfoldButton');
    const finalGreetingElement = document.getElementById('finalGreeting');
    const musicToggle = document.getElementById('musicToggle');
    const candleButton = document.getElementById('candleButton');

    const steps = {
        step1: document.getElementById('step1'),
        step2: document.getElementById('step2'),
        step3: document.getElementById('step3'),
        step4: document.getElementById('step4'),
    };

    const recipientName = "Deepi"; // Birthday recipient's preferred name
    const messageGreeting = "Happy Birthday,"; // Customizable Greeting
    document.querySelector('.recipient-name').textContent = `${recipientName}!`;

    // Load the uploaded portraits from the repository. Keep the artwork placeholders
    // until each photo has loaded so a failed request never leaves an empty frame.
    document.querySelectorAll('.birthday-photo[data-photo-slot]').forEach(photo => {
        const fileName = photo.dataset.photoSlot === 'left' ? 'pic 1.jpg' : 'pic 2.jpg';
        const placeholder = photo.closest('.photo-frame')?.querySelector('.photo-placeholder');
        photo.style.display = 'none';
        photo.addEventListener('load', () => {
            if (placeholder) placeholder.remove();
            photo.hidden = false;
            photo.style.display = 'block';
        }, { once: true });
        photo.src = encodeURI(fileName);
    });

    // --- Utility Function to Transition Steps ---
    function transitionToStep(targetStepId) {
        const currentActive = document.querySelector('.step.active');
        const nextStep = steps[targetStepId];
        if (currentActive === nextStep) return;
        if (currentActive) {
            currentActive.classList.remove('active');
            currentActive.classList.add('leaving');
            window.setTimeout(() => currentActive.classList.remove('leaving'), 700);
        }
        nextStep.classList.remove('leaving');
        nextStep.classList.add('active');
    }

    // --- Step 1: Welcome Screen Interactions ---
    startButton.addEventListener('click', () => {
        startBirthdayMusic();
        transitionToStep('step2');
    });

    function startBirthdayMusic() {
        musicToggle.hidden = false;
        backgroundMusic.play().then(() => {
            musicToggle.setAttribute('aria-pressed', 'true');
            musicToggle.textContent = '♫ Music on';
        }).catch(error => {
            console.log("Autoplay prevented:", error);
            musicToggle.setAttribute('aria-pressed', 'false');
            musicToggle.setAttribute('aria-label', 'Play birthday music');
            musicToggle.textContent = '♫ Music off';
        });
    }

    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicToggle.setAttribute('aria-pressed', 'true');
                musicToggle.textContent = '♫ Music on';
                musicToggle.setAttribute('aria-label', 'Pause birthday music');
            }).catch(() => {
                musicToggle.textContent = '♫ Try music again';
            });
        } else {
            backgroundMusic.pause();
            musicToggle.setAttribute('aria-pressed', 'false');
            musicToggle.textContent = '♫ Music off';
            musicToggle.setAttribute('aria-label', 'Play birthday music');
        }
    });

    // --- Step 2: Envelope Interactions ---
    function openEnvelope() {
        if (envelopeContainer.classList.contains('open')) return;
        envelopeContainer.classList.add('open');
        envelopeContainer.querySelector('.click-instruction').style.opacity = '0'; // Hide instruction
        window.setTimeout(() => {
            transitionToStep('step3');
            window.setTimeout(() => document.getElementById('letterContainer').classList.add('show'), 40);
        }, 900); // Let the full flap animation finish before crossfading to the letter.
    }
    envelopeContainer.addEventListener('click', openEnvelope);
    envelopeContainer.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openEnvelope();
        }
    });

    candleButton.addEventListener('click', () => {
        candleButton.classList.add('blown-out');
        candleButton.setAttribute('aria-label', 'Candle blown out');
        createConfettiCannon(45, 0.25);
    });

    // --- Step 3: Letter Unfold Interactions ---
    unfoldButton.addEventListener('click', () => {
        transitionToStep('step4');
        startCelebrationAnimations();
    });

    // --- Step 4: Grand Celebration Animations ---
    function startCelebrationAnimations() {
        // --- Typewriter Effect for Main Greeting ---
        let i = 0;
        finalGreetingElement.textContent = ''; // Clear content
        finalGreetingElement.style.borderRight = '3px solid var(--accent-yellow)'; // Ensure cursor is visible
        
        const typingInterval = setInterval(() => {
            if (i < messageGreeting.length) {
                finalGreetingElement.textContent += messageGreeting.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                finalGreetingElement.classList.add('typed'); // Add class to manage cursor animation after typing
            }
        }, 100); // Typing speed

        // --- Confetti Cannon Effect ---
        createConfettiCannon(100, 0.5); // Count, delay
        setTimeout(() => createConfettiCannon(80, 0.3), 500); // Second burst
        setTimeout(() => createConfettiCannon(60, 0.2), 1000); // Third burst

        // --- Rising Balloons ---
        createBalloons(22);
        // Keep fresh balloons and fireworks rising while the celebration is open.
        window.setInterval(() => createBalloons(5), 4200);
        window.setInterval(() => createFireworks(2), 3200);

        // Soft, twinkling lights behind the card.
        const sparklesContainer = document.querySelector('.sparkles-container');
        for (let i = 0; i < 28; i++) {
            const sparkle = document.createElement('span');
            sparkle.className = 'sparkle';
            sparkle.style.left = `${Math.random() * 100}%`;
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.setProperty('--twinkle-delay', `${Math.random() * 4}s`);
            sparkle.style.setProperty('--twinkle-duration', `${2 + Math.random() * 3}s`);
            sparklesContainer.appendChild(sparkle);
        }

        // --- Background Fireworks (Subtle) ---
        createFireworks(5); // Number of firework bursts
    }

    // --- Confetti Cannon Helper ---
    function createConfettiCannon(count, delayMultiplier) {
        const confettiCannonContainer = document.querySelector('.confetti-cannon-container');
        const colors = ['var(--primary-red)', 'var(--accent-yellow)', '#fff8ee', '#c79ab5', '#d9cbea'];

        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');

            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}vw`; // Random start X
            confetti.style.top = `${Math.random() * 20 - 10}vh`; // Slightly above/below top of screen

            // Randomize duration and delay
            const duration = Math.random() * 2 + 3; // 3-5 seconds
            const delay = Math.random() * delayMultiplier;
            confetti.style.animationDuration = `${duration}s`;
            confetti.style.animationDelay = `${delay}s`;
            
            // Randomize size and shape
            const size = Math.random() * 8 + 4; // 4-12px
            confetti.style.width = `${size}px`;
            confetti.style.height = `${size}px`;
            if (Math.random() > 0.5) confetti.style.borderRadius = '50%'; // Make some circular

            // Randomize initial rotation for confetti
            confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

            confettiCannonContainer.appendChild(confetti);

            // Remove after animation to prevent DOM bloat
            confetti.addEventListener('animationend', () => confetti.remove());
        }
    }

    // --- Balloons Helper ---
    function createBalloons(count) {
        const balloonsContainer = document.querySelector('.balloons-container');
        const colors = ['var(--primary-red)', 'var(--accent-yellow)', '#d9cbea', '#eab8c7', '#f4dfca'];

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.classList.add('balloon');

            const edge = Math.random() < 0.5;
            balloon.style.left = edge
                ? `${Math.random() * 24}vw`
                : `${76 + Math.random() * 24}vw`;
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.setProperty('--balloon-size', `${Math.random() * 22 + 54}px`);
            balloon.style.animationDuration = `${Math.random() * 4 + 11}s`; // 11-15s duration
            balloon.style.animationDelay = `${Math.random() * 1.8}s`; // Quick, gentle stagger

            balloonsContainer.appendChild(balloon);

            // Remove after animation
            balloon.addEventListener('animationend', () => balloon.remove());
        }
    }

    // --- Fireworks Helper ---
    function createFireworks(count) {
        const fireworksContainer = document.querySelector('.fireworks-container');
        const colors = ['var(--primary-red)', 'var(--accent-yellow)', '#fff8ee', '#c79ab5'];

        for (let i = 0; i < count; i++) {
            const firework = document.createElement('div');
            firework.classList.add('firework');
            
            firework.style.left = `${Math.random() * 80 + 10}vw`;
            firework.style.bottom = `${Math.random() * 20}vh`; // Launch from bottom 20%
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.boxShadow = `0 0 5px ${firework.style.backgroundColor}`; // Match box shadow to color
            
            // Stagger animation delay
            const delay = Math.random() * 3; // 0-3 second delay
            firework.style.animationDelay = `${delay}s, ${delay + 3}s`; // Launch and then explode
            
            fireworksContainer.appendChild(firework);

            firework.addEventListener('animationend', () => firework.remove());
        }
    }
});
