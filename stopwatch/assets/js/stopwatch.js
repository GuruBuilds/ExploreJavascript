/**
 * Stopwatch Class - Handles all stopwatch functionality
 */
class Stopwatch {
    constructor() {
      // State variables
      this.isRunning = false;
      this.startTime = 0;
      this.elapsedTime = 0;
      this.lapCount = 1;
      this.animationFrameId = null;
      this.laps = [];
  
      // DOM Elements
      this.elements = {
        display: document.getElementById('display'),
        startBtn: document.getElementById('startBtn'),
        pauseResumeBtn: document.getElementById('pauseResumeBtn'),
        lapBtn: document.getElementById('lapBtn'),
        resetBtn: document.getElementById('resetBtn'),
        historyList: document.getElementById('historyList'),
        lapCountBadge: document.getElementById('lapCount'),
        progressCircle: document.querySelector('.progress-circle'),
        clearLapsBtn: document.getElementById('clearLapsBtn')
      };
  
      // Initialize event listeners and state
      this.initEventListeners();
      this.loadState();
      this.setupWindowEvents();
    }
  
    /**
     * Initialize all event listeners
     */
    initEventListeners() {
      this.elements.startBtn.addEventListener('click', () => this.start());
      this.elements.pauseResumeBtn.addEventListener('click', () => this.togglePauseResume());
      this.elements.lapBtn.addEventListener('click', () => this.addLap());
      this.elements.resetBtn.addEventListener('click', () => this.reset());
      this.elements.clearLapsBtn.addEventListener('click', () => this.clearLaps());
    }
  
    /**
     * Setup window events for state management
     */
    setupWindowEvents() {
      window.addEventListener('beforeunload', () => this.saveState());
      window.addEventListener('blur', () => {
        if (this.isRunning) {
          this.saveState();
        }
      });
      window.addEventListener('focus', () => {
        if (this.isRunning) {
          this.syncTime();
        }
      });
    }
  
    /**
     * Start the stopwatch
     */
    start() {
      if (this.isRunning) return;
      
      this.isRunning = true;
      this.startTime = Date.now() - this.elapsedTime;
      this.update();
      this.updateButtons();
      this.saveState();
    }
  
    /**
     * Toggle between pause and resume
     */
    togglePauseResume() {
      this.isRunning = !this.isRunning;
      
      if (this.isRunning) {
        this.startTime = Date.now() - this.elapsedTime;
        this.update();
      } else {
        cancelAnimationFrame(this.animationFrameId);
      }
      
      this.updateButtons();
      this.saveState();
    }
  
    /**
     * Reset the stopwatch
     */
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
  
    /**
     * Update the stopwatch time
     */
    update() {
      if (!this.isRunning) return;
      
      this.elapsedTime = Date.now() - this.startTime;
      this.updateDisplay();
      this.updateProgress((this.elapsedTime % 60000) / 60000);
      this.animationFrameId = requestAnimationFrame(() => this.update());
    }
  
    /**
     * Sync time when returning to the app
     */
    syncTime() {
      if (this.isRunning) {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        this.updateProgress((this.elapsedTime % 60000) / 60000);
      }
    }
  
    /**
     * Update the display with current time
     */
    updateDisplay() {
      const hours = Math.floor(this.elapsedTime / 3600000).toString().padStart(2, '0');
      const minutes = Math.floor((this.elapsedTime % 3600000) / 60000).toString().padStart(2, '0');
      const seconds = Math.floor((this.elapsedTime % 60000) / 1000).toString().padStart(2, '0');
      const milliseconds = Math.floor(this.elapsedTime % 1000 / 10).toString().padStart(2, '0');
      
      this.elements.display.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }
  
    /**
     * Update the progress ring
     * @param {number} percentage - Current percentage (0-1)
     */
    updateProgress(percentage) {
      const circumference = 283;
      const offset = circumference - (percentage * circumference);
      
      if (percentage === 0) {
        this.elements.progressCircle.style.transition = 'none';
        this.elements.progressCircle.style.strokeDashoffset = offset;
        setTimeout(() => {
          this.elements.progressCircle.style.transition = 'stroke-dashoffset 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 10);
      } else {
        this.elements.progressCircle.style.strokeDashoffset = offset;
      }
    }
  
    /**
     * Add a new lap
     */
    addLap() {
      const lapData = {
        number: this.lapCount,
        time: this.elements.display.textContent,
        timestamp: Date.now()
      };
      
      this.laps.unshift(lapData);
      this.renderLap(lapData);
      this.lapCount++;
      this.updateLapCount();
      this.saveState();
    }
  
    /**
     * Render a single lap item
     * @param {object} lapData - Lap data to render
     */
    renderLap(lapData) {
      const lapItem = document.createElement('div');
      lapItem.className = 'lap-item';
      lapItem.innerHTML = `
        <span>Lap ${lapData.number}</span>
        <span>${lapData.time}</span>
        <i class="fas fa-trash delete-lap"></i>
      `;
      
      lapItem.querySelector('.delete-lap').addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeLap(lapData.timestamp);
      });
      
      this.elements.historyList.prepend(lapItem);
    }
  
    /**
     * Remove a lap by timestamp
     * @param {number} timestamp - Unique lap identifier
     */
    removeLap(timestamp) {
      this.laps = this.laps.filter(lap => lap.timestamp !== timestamp);
      this.elements.historyList.innerHTML = '';
      this.laps.forEach(lap => this.renderLap(lap));
      this.updateLapCount();
      this.saveState();
    }
  
    /**
     * Clear all laps
     */
    clearLaps() {
      this.laps = [];
      this.elements.historyList.innerHTML = '';
      this.lapCount = 1;
      this.updateLapCount();
      this.saveState();
    }
  
    /**
     * Update the lap count badge
     */
    updateLapCount() {
      this.elements.lapCountBadge.textContent = this.laps.length;
    }
  
    /**
     * Update button states
     */
    updateButtons() {
      this.elements.startBtn.disabled = this.isRunning;
      this.elements.pauseResumeBtn.disabled = !this.isRunning && this.elapsedTime === 0;
      this.elements.lapBtn.disabled = !this.isRunning;
      
      this.elements.pauseResumeBtn.innerHTML = this.isRunning 
        ? '<i class="fas fa-pause"></i>'
        : '<i class="fas fa-play"></i>';
    }
  
    /**
     * Save current state to localStorage
     */
    saveState() {
      const state = {
        isRunning: this.isRunning,
        startTime: this.startTime,
        elapsedTime: this.elapsedTime,
        laps: this.laps,
        lapCount: this.lapCount
      };
      
      localStorage.setItem('stopwatchState', JSON.stringify(state));
    }
  
    /**
     * Load state from localStorage
     */
    loadState() {
      try {
        const saved = localStorage.getItem('stopwatchState');
        if (!saved) return;
  
        const state = JSON.parse(saved);
  
        // Restore basic state
        this.isRunning = state.isRunning;
        this.startTime = state.startTime;
        this.elapsedTime = state.elapsedTime;
        this.lapCount = state.lapCount || 1;
        this.laps = state.laps || [];
  
        // Restore laps
        this.elements.historyList.innerHTML = '';
        this.laps.forEach(lap => this.renderLap(lap));
  
        // Restore timer if running
        if (this.isRunning) {
          this.syncTime();
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
  
  // Initialize the stopwatch when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => new Stopwatch());