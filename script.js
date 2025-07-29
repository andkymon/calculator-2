// Calculator state
let num1 = null;
let num2 = null;
let operation = null;
let activeOperatorButton = null;

function getDisplayResult(a, b, op) {
    if (b === 0 && op === '÷') return 'Error';

    const x = parseFloat(a);
    const y = parseFloat(b);
    const result = performOperation(x, y, op);
    if (result === null) return b;
    if (Math.abs(result) > 1e160) return 'Error';
    return formatResult(result);
}

function performOperation(x, y, op) {
    switch (op) {
        case '+': return x + y;
        case '-': return x - y;
        case '×': return x * y;
        case '÷': return x / y;
        default: return null;
    }
}

// If result length (excluding minus and decimal) > 9, use scientific notation, else return as string
function formatResult(result) {
    const resultStr = result.toString();
    if (resultStr.replace(/[-.]/g, '').length > 9) {
        return result.toExponential(4);
    }
    return resultStr;
}

function resetCalculator() {
    num1 = null;    
    num2 = null;
    operation = null;
    
    if (activeOperatorButton) {
        activeOperatorButton.classList.remove('active');
        activeOperatorButton = null;
    }
}

const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.btn.number');
const clearButton = document.querySelector('.btn.function.clear');
numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => {
        // Prevent inputting more than 9 digits (ignore decimal point)
        const digitCount = display.textContent.replace(/\D/g, '').length;
        if (digitCount >= 9 && activeOperatorButton === null) return; // Allow entering more digits if an operator is active as a second value is being entered

        // Prevent multiple decimal inputs
        if (numberButton.textContent === '.' && display.textContent.includes('.')) return;

        // If entering the second value (clicking a number after an operation is clicked)
        if (num1 !== null && activeOperatorButton) {
            display.textContent = numberButton.textContent;
            activeOperatorButton.classList.remove('active');
            activeOperatorButton = null;
        } else if (display.textContent === '0' || /e[+-]?\d+$/i.test(display.textContent)) {
            // If display is 0 or in scientific notation, replace it with the clicked number
            display.textContent = numberButton.textContent;

            // Update clear button text to 'C' when a number is clicked
            if (clearButton.textContent === 'AC') {
                clearButton.textContent = 'C';
            }
        } else {
            // Otherwise, append clicked number to display
            display.textContent += numberButton.textContent;
        }
    });
});

const operationButtons = document.querySelectorAll('.btn.operator');
operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        // Remove highlight from previous operation if any
        if (activeOperatorButton) {
            activeOperatorButton.classList.remove('active');
        } else if (num1 === null) {
            // If first number not yet set, save current display as num1
            num1 = display.textContent;
        } else if (num1 !== null) {
            // If num1 is set and a new operation is clicked (after entering second value), solve
            num2 = display.textContent;
            const result = getDisplayResult(num1, num2, operation);
            display.textContent = result;
            num1 = result;
        } 

        // Highlight the clicked button then save operation
        operationButton.classList.add('active');
        activeOperatorButton = operationButton;
        operation = operationButton.textContent;
    });
});

const equalsButton = document.querySelector('.btn.equals');
equalsButton.addEventListener('click', () => {
    if (num1 !== null && operation) {
        if (!activeOperatorButton) { // Skip this snippet if an operator button is still active
            num2 = display.textContent;
            const result = getDisplayResult(num1, num2, operation);
            display.textContent = result;
        }
        resetCalculator();
    }
});

clearButton.addEventListener('click', () => {
    display.textContent = '0';
    clearButton.textContent = 'AC';
    resetCalculator();
});

const backspaceButton = document.querySelector('.btn.backspace');
backspaceButton.addEventListener('click', () => {
    if (display.textContent === '0') return;
    if (display.textContent.length === 1 
        || (display.textContent.length === 2 && display.textContent.startsWith('-'))
        || display.textContent === 'Error'
        || display.textContent === NaN 
        || /e[+-]?\d+$/i.test(display.textContent)) {
        display.textContent = '0';
    } else {
        display.textContent = display.textContent.slice(0, -1);
    }
});

const percentButton = document.querySelector('.btn.function.percent');
percentButton.addEventListener('click', () => {
    if (display.textContent === 'Error') return;
    display.textContent = getDisplayResult(display.textContent, '100', '÷');
});

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        const btn = Array.from(document.querySelectorAll('.btn.number')).find(b => b.textContent === key);
        btn.click();
        event.preventDefault();
    }

    if (key === '+' || key === '-' || key === '*' || key === '/' || key === 'x' || key === 'X') {
        let op = key;
        if (op === '*' || op === 'x' || op === 'X') op = '×';
        if (op === '/') op = '÷';
        const btn = Array.from(document.querySelectorAll('.btn.operator')).find(b => b.textContent === op);
        btn.click();
        event.preventDefault();
    }

    if (key === '=' || key === 'Enter') {
        const btn = document.querySelector('.btn.equals');
        btn.click();
        event.preventDefault();
    }
    
    if (key === 'Escape') {
        const btn = document.querySelector('.btn.function.clear');
        btn.click();
        event.preventDefault();
    }
    
    if (key === 'Backspace') {
        const btn = document.querySelector('.btn.function.backspace');
        btn.click();
        event.preventDefault();
    }
});