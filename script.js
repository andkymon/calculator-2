const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.btn.number');
const clearButton = document.querySelector('.btn.function');

// Variables to store calculator state
let num1 = null;
let num2 = null;
let operation = null;

// Number button functionality
numberButtons.forEach(numberButton => {
    numberButton.addEventListener('click', () => {
        // Prevent adding more than 9 digits (ignore decimal point)
        const digitCount = display.textContent.replace(/\D/g, '').length;
        if (digitCount >= 9) return;

        // If entering the second value (after operation selected)
        if (num1 !== null && previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
            display.textContent = numberButton.textContent;
            previouslyClickedButton.classList.remove('active');
            previouslyClickedButton = null;
        } else if (display.textContent === '0') {
            // If display is '0', replace it with the clicked number
            display.textContent = numberButton.textContent;
        } else {
            // Otherwise, append the clicked number to the display
            display.textContent += numberButton.textContent;
        }

        // Update the clear button text to 'C' when a number is added
        clearButton.textContent = 'C';
    });
});

// Operation button functionality
const operationButtons = document.querySelectorAll('.btn.operator');
let previouslyClickedButton = null;

operationButtons.forEach(operationButton => {
    operationButton.addEventListener('click', () => {
        // When operation is clicked, and no operation or equals was previously clicked, save current display value as first number
        if ((!previouslyClickedButton || !previouslyClickedButton.classList.contains('operator')) && num1 === null) {
            previouslyClickedButton = operationButton;
            operationButton.classList.add('active');
            num1 = display.textContent;
            operation = operationButton.textContent;
            return;
        }

        // If another operation was already active, remove its highlight
        if (previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
            previouslyClickedButton.classList.remove('active');
        }

        // Highlight the clicked button
        operationButton.classList.add('active');
        previouslyClickedButton = operationButton;

        // Set operation to clicked button's text content
        operation = operationButton.textContent;
    });
});

// Clear button functionality
clearButton.addEventListener('click', () => {
    display.textContent = '0';
    clearButton.textContent = 'AC';

    // If an operation is active, remove its highlight
    if (previouslyClickedButton && previouslyClickedButton.classList.contains('operator')) {
        previouslyClickedButton.classList.remove('active');
    }

    // Reset calculator state
    num1 = null;
    num2 = null;
    operation = null;
});