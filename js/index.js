import { FibCanvas } from './FibCanvas.js';

(function () {
    const fibCanvas = new FibCanvas();

    const btnNext = document.querySelector('.fib-next');
    const btnReset = document.querySelector('.fib-reset');

    btnNext.addEventListener('click', () => fibCanvas.nextNumber());
    btnReset.addEventListener('click', () => fibCanvas.resetToStart());
})();
