document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelectorAll('.calc-btn');
    let resetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;
            const currentDisplay = display.textContent;
            const operators = ['×', '÷', '%', '+', '-'];

            if (value === 'AC') {
                display.textContent = '0';
                resetDisplay = false;
            } else if (value === 'DEL') {
                display.textContent = currentDisplay.slice(0, -1) || '0';
                resetDisplay = false;
            } else if (/\d/.test(value)) {
                if (resetDisplay || currentDisplay === '0') {
                    display.textContent = value;
                    resetDisplay = false;
                } else {
                    display.textContent += value;
                }
            } else if (operators.includes(value)) {
                const lastChar = currentDisplay.slice(-1);
                
                if (value === '-' && currentDisplay === '0') {
                    display.textContent = '-';
                }
                else if (operators.includes(lastChar)) {
                    display.textContent = currentDisplay.slice(0, -1) + value;
                } else {
                    display.textContent += value;
                }
                resetDisplay = false;
            } else if (value === '.') {
                if (resetDisplay) {
                    display.textContent = '0.';
                    resetDisplay = false;
                    return;
                }
                const lastChar = currentDisplay.slice(-1);
                if (operators.includes(lastChar)) {
                    display.textContent += '0.';
                } else {
                    const parts = currentDisplay.split(/[×÷%+-]/);
                    const lastPart = parts[parts.length - 1];
                    if (!lastPart.includes('.')) {
                        display.textContent += '.';
                    }
                }
            } else if (value === '=') {
                if (resetDisplay) return;
                try {
                    let expression = currentDisplay
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/%/g, '*0.01');
                    
                    if (expression.startsWith('-')) {
                        expression = '0' + expression;
                    }
                    
                    let result = math.evaluate(expression);
                    
                    if (Number.isFinite(result)) {
                        result = Number(result.toPrecision(12));
                        display.textContent = result.toString()
                            .replace(/(\.[0-9]*[1-9])0+$/, '$1')
                            .replace(/\.$/, '');
                    } else {
                        display.textContent = 'Error';
                    }
                    resetDisplay = true;
                } catch (e) {
                    display.textContent = 'Error';
                    resetDisplay = true;
                }
            }
        });
    });

    document.addEventListener('keydown', (e) => {
        const key = e.key;
        const button = Array.from(buttons).find(b => 
            b.textContent === key ||
            (key === 'Enter' && b.textContent === '=') ||
            (key === '*' && b.textContent === '×') ||
            (key === '/' && b.textContent === '÷') ||
            (key === 'Backspace' && b.textContent === 'DEL') ||
            (key === 'Escape' && b.textContent === 'AC')
        );
        if (button) button.click();
    });
});