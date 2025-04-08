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
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.startTime = Date.now() - this.elapsedTime;
        this.update();
        this.updateButtons();
    }

    togglePauseResume() {
        this.isRunning = !this.isRunning;
        if (this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.update();
        }
        this.updateButtons();
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
    }

    update() {
        if (!this.isRunning) return;
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        this.updateProgress((this.elapsedTime % 60000) / 60000);
        this.animationFrameId = requestAnimationFrame(() => this.update());
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
        
        lapItem.querySelector('.delete-lap').addEventListener('click', (e) => {
            lapItem.remove();
            this.updateLapCount();
        });

        this.historyList.prepend(lapItem);
        this.lapCount++;
        this.updateLapCount();
    }

    clearLaps() {
        this.historyList.innerHTML = '';
        this.lapCount = 1;
        this.updateLapCount();
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
    }
}

// Initialize Stopwatch
const stopwatch = new Stopwatch();