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

        // If display is '0', replace it with the clicked number
        // Otherwise, append the clicked number to the display
        if (display.textContent === '0') {
            display.textContent = numberButton.textContent;
        } else {
            display.textContent += numberButton.textContent;
        }

        // Update the clear button text to 'C' when a number is added
        clearButton.textContent = 'C';
    });
});

// Clear button functionality
clearButton.addEventListener('click', () => {
    display.textContent = '0';
    clearButton.textContent = 'AC';

    // Reset calculator state
    num1 = null;
    num2 = null;
    operation = null;
});