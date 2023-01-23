import { FibCanvas } from './FibCanvas.js';

(function () {
    const fibCanvas = new FibCanvas();

    const btnNext = document.querySelector('.fib-next');
    const btnReset = document.querySelector('.fib-reset');
    const btnPrev = document.querySelector('.fib-prev');

    btnNext.addEventListener('click', () => {
        blockActionPanelWhileInProgress(fibCanvas.nextNumber());
    });
    btnPrev.addEventListener('click', () => {
        blockActionPanelWhileInProgress(fibCanvas.prevNumber());
    });
    btnReset.addEventListener('click', () => fibCanvas.resetToStart());
})();

function blockActionPanelWhileInProgress(promise) {
    const actionsPanelDomElement = document.querySelector('.panel-actions');
    actionsPanelDomElement.style.opacity = 0;

    promise.then(() => {
        actionsPanelDomElement.style.opacity = 1;
    });
}
