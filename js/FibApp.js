import { FibCanvas } from './FibCanvas.js';

export class FibApp {
    #fibCanvas;

    #btnStop;

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

        this.#btnStop = btnStop;

        btnNext.addEventListener('click', async () => {
            await this.#fibCanvas.stop();

            btnStop.disabled = false;

            this.#fibCanvas.nextNumber();
        });

        btnPrev.addEventListener('click', async () => {
            await this.#fibCanvas.stop();

            btnStop.disabled = false;

            this.#fibCanvas.prevNumber();
        });

        btnReset.addEventListener('click', async () => {
            await this.#fibCanvas.stop();

            btnStop.disabled = true;

            this.#fibCanvas.resetToStart();
        });

        btnPlayForwards.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClass();
            btnPlayForwards.classList.add('btn-radio-active');

            await this.#fibCanvas.stop();

            btnStop.disabled = false;

            this.#blockStepButtonsWhileInProgress(
                this.#fibCanvas.playForwards()
            );
        });

        btnPlayBackwards.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClass();
            btnPlayBackwards.classList.add('btn-radio-active');

            await this.#fibCanvas.stop();

            btnStop.disabled = false;

            this.#blockStepButtonsWhileInProgress(
                this.#fibCanvas.playBackwards()
            );
        });

        btnStop.addEventListener('click', async () => {
            btnStop.disabled = true;
            await this.#fibCanvas.stop();
            this.#removeBtnRadioActiveClass();
        });
    }

    #removeBtnRadioActiveClass() {
        document
            .querySelectorAll('.btn-radio')
            .forEach((el) => el.classList.remove('btn-radio-active'));
    }

    #blockStepButtonsWhileInProgress(promise) {
        const btnSteps = document.querySelectorAll('.fib-prev, .fib-next');

        btnSteps.forEach((el) => (el.disabled = true));

        promise.then(() => {
            btnSteps.forEach((el) => (el.disabled = false));
            this.#btnStop.disabled = true;
        });
    }
}
