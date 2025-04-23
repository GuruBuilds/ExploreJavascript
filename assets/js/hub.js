document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        { 
            title: "Calculator", 
            icon: `<svg><use href="#calculator"/></svg>`,
            url: "calculator/index.html",
            color: "color-purple"
        },
        { 
            title: "Stopwatch", 
            icon: `<svg><use href="#stopwatch"/></svg>`,
            url: "stopwatch/index.html",
            color: "color-blue"
        },
        { 
            title: "Weather App", 
            icon: `<svg><use href="#weather"/></svg>`,
            url: "weather-app/index.html",
            color: "color-green"
        },
        { 
            title: "Todo List", 
            icon: `<svg><use href="#todo"/></svg>`,
            url: "todo-list/index.html",
            color: "color-red"
        },
        { 
            title: "Quiz App", 
            icon: `<svg><use href="#quiz"/></svg>`,
            url: "quiz-app/index.html",
            color: "color-yellow"
        },
        { 
            title: "Drawing Board", 
            icon: `<svg><use href="#draw"/></svg>`,
            url: "drawing-app/index.html",
            color: "color-pink"
        },
        { 
            title: "Music Player", 
            icon: `<svg><use href="#music"/></svg>`,
            url: "music-player/index.html",
            color: "color-purple"
        },
        { 
            title: "Chat App", 
            icon: `<svg><use href="#chat"/></svg>`,
            url: "chat-app/index.html",
            color: "color-blue"
        },
        { 
            title: "Mini Game", 
            icon: `<svg><use href="#game"/></svg>`,
            url: "game/index.html",
            color: "color-green"
        }
    ];

    function generateProjectCards() {
        const container = document.getElementById('projectsContainer');
        container.innerHTML = projects.map(project => `
            <a href="${project.url}" class="project-card ${project.color || ''}">
                <div class="project-icon">${project.icon}</div>
                <span class="project-name">${project.title}</span>
            </a>
        `).join('');
    }

    generateProjectCards();
});