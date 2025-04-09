class Stopwatch {
    constructor() {
        this.isRunning = false;
        this.startTime = 0;
        this.elapsedTime = 0;
        this.lapCount = 1;
        this.animationFrameId = null;
        this.isDarkTheme = false;

        // DOM Elements
        this.display = document.getElementById('display');
        this.startBtn = document.getElementById('startBtn');
        this.pauseResumeBtn = document.getElementById('pauseResumeBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.historyList = document.getElementById('historyList');
        this.themeIcon = document.getElementById('themeIcon');
        this.lapCountBadge = document.getElementById('lapCount');
        this.progressCircle = document.querySelector('.progress-circle');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');

        // Event Listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseResumeBtn.addEventListener('click', () => this.togglePauseResume());
        this.lapBtn.addEventListener('click', () => this.addLap());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.themeIcon.addEventListener('click', () => this.toggleTheme());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());

        // Load saved state
        this.loadState();
        window.addEventListener('beforeunload', () => this.saveState());
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.update();
        this.updateButtons();
        this.saveState();
    }

    togglePauseResume() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.update();
        }
        this.updateButtons();
        this.saveState();
    }

    reset() {
        if (this.elapsedTime > 0 && !this.isRunning) {
            this.addLap();
        }
        this.isRunning = false;
        cancelAnimationFrame(this.animationFrameId);
        this.elapsedTime = 0;
        this.updateDisplay();
        this.updateProgress(0);
        this.updateButtons();
        this.saveState();
    }

    update() {
        if (!this.isRunning) return;
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        this.updateProgress((this.elapsedTime % 60000) / 60000);
        this.animationFrameId = requestAnimationFrame(() => this.update());
        this.saveState();
    }

    updateDisplay() {
        const hours = Math.floor(this.elapsedTime / 3600000).toString().padStart(2, '0');
        const minutes = Math.floor((this.elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
        const seconds = Math.floor((this.elapsedTime % 60000) / 1000).toString().padStart(2, '0');
        const milliseconds = Math.floor(this.elapsedTime % 1000).toString().padStart(3, '0').slice(0, 2);
        this.display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    updateProgress(percentage) {
        const circumference = 283;
        const offset = circumference - (percentage * circumference);
        
        if(percentage === 0) {
            this.progressCircle.style.transition = 'none';
            this.progressCircle.style.strokeDashoffset = offset;
            setTimeout(() => {
                this.progressCircle.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);
        } else {
            this.progressCircle.style.strokeDashoffset = offset;
        }
    }

    addLap() {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        lapItem.innerHTML = `
            <span>Lap ${this.lapCount}</span>
            <span>${this.display.textContent}</span>
            <i class="fas fa-trash delete-lap"></i>
        `;
        
        lapItem.querySelector('.delete-lap').addEventListener('click', () => {
            lapItem.remove();
            this.updateLapCount();
            this.saveState();
        });

        this.historyList.prepend(lapItem);
        this.lapCount++;
        this.updateLapCount();
        this.saveState();
    }

    clearLaps() {
        this.historyList.innerHTML = '';
        this.lapCount = 1;
        this.updateLapCount();
        this.saveState();
    }

    updateLapCount() {
        this.lapCountBadge.textContent = this.historyList.children.length;
    }

    updateButtons() {
        this.startBtn.disabled = this.isRunning;
        this.pauseResumeBtn.disabled = !this.isRunning && this.elapsedTime === 0;
        this.lapBtn.disabled = !this.isRunning;
        
        this.pauseResumeBtn.innerHTML = this.isRunning 
            ? '<i class="fas fa-pause"></i>'
            : '<i class="fas fa-play-circle"></i>';
    }

    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        document.body.classList.toggle('dark-theme');
        this.themeIcon.classList.toggle('fa-moon');
        this.themeIcon.classList.toggle('fa-sun');
        this.saveState();
    }

    // Cookie handling methods
    saveState() {
        const state = {
            isRunning: this.isRunning,
            startTime: this.startTime,
            elapsedTime: this.elapsedTime,
            laps: Array.from(this.historyList.children).reverse().map(lap => {
                const spans = lap.querySelectorAll('span');
                return {
                    number: spans[0].textContent,
                    time: spans[1].textContent
                };
            }),
            isDarkTheme: this.isDarkTheme
        };
        localStorage.setItem('stopwatchState', JSON.stringify(state));
    }

    loadState() {
        try {
            const saved = localStorage.getItem('stopwatchState');
            if (!saved) return;

            const state = JSON.parse(saved);

            // Restore basic state
            this.isRunning = state.isRunning;
            this.startTime = state.startTime;
            this.elapsedTime = state.elapsedTime;
            this.isDarkTheme = state.isDarkTheme;

            // Restore theme
            if (this.isDarkTheme) {
                document.body.classList.add('dark-theme');
                this.themeIcon.classList.replace('fa-moon', 'fa-sun');
            }

            // Restore laps
            this.historyList.innerHTML = '';
            this.lapCount = 1;
            state.laps.forEach(lapData => {
                const lapItem = document.createElement('div');
                lapItem.className = 'lap-item';
                lapItem.innerHTML = `
                    <span>${lapData.number}</span>
                    <span>${lapData.time}</span>
                    <i class="fas fa-trash delete-lap"></i>
                `;
                lapItem.querySelector('.delete-lap').addEventListener('click', () => {
                    lapItem.remove();
                    this.updateLapCount();
                    this.saveState();
                });
                this.historyList.prepend(lapItem);
                this.lapCount = parseInt(lapData.number.split(' ')[1]) + 1;
            });

            // Restore timer if running
            if (this.isRunning) {
                const currentTime = Date.now();
                this.elapsedTime = currentTime - this.startTime;
                this.startTime = currentTime - this.elapsedTime;
                this.update();
            }

            this.updateDisplay();
            this.updateProgress((this.elapsedTime % 60000) / 60000);
            this.updateButtons();
            this.updateLapCount();

        } catch (e) {
            console.error('Failed to load state:', e);
            localStorage.removeItem('stopwatchState');
        }
    }
}

// Initialize Stopwatch
const stopwatch = new Stopwatch();
