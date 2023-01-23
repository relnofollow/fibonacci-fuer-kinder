import { FibCanvas } from './FibCanvas.js';

(function () {
    const fibCanvas = new FibCanvas();

    const btnNext = document.querySelector('.fib-next');
    const btnReset = document.querySelector('.fib-reset');
    const btnPrev = document.querySelector('.fib-prev');

    btnNext.addEventListener('click', () => fibCanvas.nextNumber());
    btnPrev.addEventListener('click', () => fibCanvas.prevNumber());
    btnReset.addEventListener('click', () => fibCanvas.resetToStart());
})();
