const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.btn.number');
const clearButton = document.querySelector('.btn.function');

// Calculator state
let num1 = null;
let num2 = null;
let operation = null;

function solve(a, b, op) {
    const x = parseFloat(a);
    const y = parseFloat(b);
    switch (op) {
        case '+': return (x + y).toString();
        case '-': return (x - y).toString();
        case '×': return (x * y).toString();
        case '÷': return y !== 0 ? (x / y).toString() : 'Error';
        default: return b;
    }
}

numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => {
        // Prevent inputting more than 9 digits (ignore decimal point)
        const digitCount = display.textContent.replace(/\D/g, '').length;
        if (digitCount >= 9) return;

        // If entering the second value (clicking a number after an operation is clicked)
        if (num1 !== null && previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
            display.textContent = numberButton.textContent;
            previouslyClickedButton.classList.remove('active');
            previouslyClickedButton = null;
        } else if (display.textContent === '0') {
            // If display is 0, replace it with the clicked number
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
let previouslyClickedButton = null;

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        // Remove highlight from previous operation if any
        if (previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
            previouslyClickedButton.classList.remove('active');
        } else if (num1 === null) {
            // If first number not yet set, save current display as num1
            num1 = display.textContent;
        } else if (num1 !== null) {
            // If num1 is set and a new operation is clicked (after entering second value), solve
            num2 = display.textContent;
            const result = solve(num1, num2, operation);
            display.textContent = result;
            num1 = result;
        } 

        // Highlight the clicked button
        operationButton.classList.add('active');
        previouslyClickedButton = operationButton;

        // Save operation
        operation = operationButton.textContent;
    });
});

clearButton.addEventListener('click', () => {
    display.textContent = '0';
    clearButton.textContent = 'AC';

    // If an operation was clicked, remove its highlight
    if (previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
        previouslyClickedButton.classList.remove('active');
    }

    // Reset calculator state
    num1 = null;
    num2 = null;
    operation = null;
});