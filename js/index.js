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
    const btnStop = document.querySelector('.panel-stop');
    const actionPanelDomElements = document.querySelectorAll(
        '.panel-step-btns, .panel-radio-btns'
    );

    actionPanelDomElements.forEach((el) => el.classList.add('fib-hidden'));
    btnStop.classList.remove('fib-display-none');

    promise.then(() => {
        actionPanelDomElements.forEach((el) =>
            el.classList.remove('fib-hidden')
        );
        btnStop.classList.add('fib-display-none');
    });
}
