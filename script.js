
document.addEventListener('DOMContentLoaded', () => {
    // Local Storage Management
    const LocalStorageManager = {
        setPreference(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Error saving to localStorage:', error);
            }
        },
        
        getPreference(key, defaultValue = null) {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : defaultValue;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return defaultValue;
            }
        }
    };

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const animationToggle = document.getElementById('animation-toggle');
    const body = document.body;

    // Load saved preferences
    const savedThemePreference = LocalStorageManager.getPreference('darkMode', false);
    const savedAnimationPreference = LocalStorageManager.getPreference('animationsEnabled', true);

    // Apply saved preferences
    if (savedThemePreference) {
        body.classList.add('dark-mode');
        themeToggle.checked = true;
    }

    if (!savedAnimationPreference) {
        body.classList.add('animations-disabled');
        animationToggle.checked = false;
    }

    // Theme Toggle Event
    themeToggle.addEventListener('change', (e) => {
        body.classList.toggle('dark-mode');
        LocalStorageManager.setPreference('darkMode', e.target.checked);
    });

    // Animation Toggle Event
    animationToggle.addEventListener('change', (e) => {
        body.classList.toggle('animations-disabled');
        LocalStorageManager.setPreference('animationsEnabled', e.target.checked);
    });

    // PCR Simulation
    const startButton = document.getElementById('start-simulation');
    const cycleCountDisplay = document.getElementById('cycle-count');
    const simulationFeedback = document.getElementById('simulation-feedback');

    let cycleCount = 0;
    const MAX_CYCLES = 30;

    startButton.addEventListener('click', () => {
        if (cycleCount >= MAX_CYCLES) {
            // Reset simulation
            cycleCount = 0;
            simulationFeedback.textContent = 'Simulation Reset';
            simulationFeedback.classList.add('show');
        } else {
            cycleCount++;
            cycleCountDisplay.textContent = cycleCount;

            // Provide feedback based on cycle count
            const feedbackMessages = [
                'Denaturation complete',
                'Primers annealing',
                'DNA extending',
                'Cycle progressing...'
            ];

            const messageIndex = (cycleCount - 1) % feedbackMessages.length;
            simulationFeedback.textContent = feedbackMessages[messageIndex];
            simulationFeedback.classList.add('show');

            // Remove feedback after 2 seconds
            setTimeout(() => {
                simulationFeedback.classList.remove('show');
            }, 2000);
        }

        // Trigger button pulse animation
        startButton.classList.add('pulse');
        setTimeout(() => {
            startButton.classList.remove('pulse');
        }, 500);
    });

    // Optional: Add interaction tracking
    const interactionTracker = {
        simulationStarts: 0,
        themeToggles: 0,
        
        track(eventType) {
            this[eventType]++;
            LocalStorageManager.setPreference('interactions', this);
        }
    };

    // Load previous interaction data
    const savedInteractions = LocalStorageManager.getPreference('interactions', {
        simulationStarts: 0,
        themeToggles: 0
    });
    Object.assign(interactionTracker, savedInteractions);

    // Track interactions
    startButton.addEventListener('click', () => {
        interactionTracker.track('simulationStarts');
    });

    themeToggle.addEventListener('change', () => {
        interactionTracker.track('themeToggles');
    });
});