import { FibCanvas } from './FibCanvas.js';

export class FibApp {
    #fibCanvas;

    constructor() {}

    start() {
        this.#fibCanvas = new FibCanvas();
        this.#bindListeners();
    }

    #bindListeners() {
        const btnNext = document.querySelector('.fib-next');
        const btnReset = document.querySelector('.fib-reset');
        const btnPrev = document.querySelector('.fib-prev');
        const btnPlayForwards = document.querySelector('.fib-forwards');
        const btnPlayBackwards = document.querySelector('.fib-backwards');
        const btnStop = document.querySelector('.fib-stop');

        btnNext.addEventListener('click', () => {
            this.#blockActionPanelWhileInProgress(this.#fibCanvas.nextNumber());
        });

        btnPrev.addEventListener('click', () => {
            this.#blockActionPanelWhileInProgress(this.#fibCanvas.prevNumber());
        });

        btnReset.addEventListener('click', () => {
            this.#fibCanvas.resetToStart();
        });

        btnPlayForwards.addEventListener('click', () => {
            this.#removeBtnRadioActiveClass();
            btnPlayForwards.classList.add('btn-radio-active');
            this.#blockActionPanelWhileInProgress(
                this.#fibCanvas.playForwards(),
                /*blockOnlyStepsPanel=*/ true
            );
        });

        btnPlayBackwards.addEventListener('click', () => {
            this.#removeBtnRadioActiveClass();
            btnPlayBackwards.classList.add('btn-radio-active');
            this.#blockActionPanelWhileInProgress(
                this.#fibCanvas.playBackwards(),
                /*blockOnlyStepsPanel=*/ true
            );
        });

        btnStop.addEventListener('click', () => {
            this.#fibCanvas.stopAnimation();
        });
    }

    #removeBtnRadioActiveClass() {
        document
            .querySelectorAll('.btn-radio')
            .forEach((el) => el.classList.remove('btn-radio-active'));
    }

    #blockActionPanelWhileInProgress(promise, blockOnlyStepsPanel = false) {
        const btnStop = document.querySelector('.panel-stop');
        const actionPanelDomElements = document.querySelectorAll(
            '.panel-step-btns' +
                (blockOnlyStepsPanel ? '' : ', .panel-radio-btns')
        );

        actionPanelDomElements.forEach((el) => el.classList.add('fib-hidden'));
        btnStop.classList.remove('fib-display-none');

        promise.then(() => {
            actionPanelDomElements.forEach((el) =>
                el.classList.remove('fib-hidden')
            );
            btnStop.classList.add('fib-display-none');

            this.#removeBtnRadioActiveClass();
        });
    }
}
