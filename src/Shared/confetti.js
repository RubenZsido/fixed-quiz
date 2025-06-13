// Import confetti from the global scope since it's loaded via CDN
const confetti = window.confetti;

// Confetti configuration and helper functions
let count = 400;
let multiplier = 1;

const defaults = {
    origin: { y: 0.7 }
};

// Fires confetti with given parameters
function fire(particleRatio, opts) {
    const defaults = {
        spread: 180,
        origin: { y: -0.1 },
        startVelocity: -35
    };
    confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * multiplier * particleRatio)
    });
}

// Main confetti function that creates the celebration effect
export function celebrateWithConfetti(perfectQuestion, streak, streakElement, score, scoreElement, timeSinceQuestionStarted) {
    if (!perfectQuestion) {
        streak = 1;
        streakElement.textContent = `Combo: ${streak - 1}`;
        return { score, streak };
    }
    
    streak++;
    streakElement.textContent = `Combo: ${streak - 1}`;
    multiplier = Math.max(1 - (timeSinceQuestionStarted / 10) * 0.8, 0.2);
    score += 1 + (streak * multiplier);
    console.table({ score, streak, multiplier });
    scoreElement.textContent = `Score: ${Math.round(score)}`;
    
    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });
    fire(0.2, {
        spread: 60,
    });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });

    return { score, streak };
} 