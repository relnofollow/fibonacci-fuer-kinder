import { FibCanvas } from './FibCanvas.js';

const SPEED_PRESETS = [1, 2, 3, 10, 50];

export class FibApp {
    #fibCanvas;

    #btnNext;
    #btnReset;
    #btnPrev;
    #btnPlayForwards;
    #btnPlayBackwards;
    #btnStop;
    #btnsSpeed;

    constructor() {}

    start() {
        this.#fibCanvas = new FibCanvas();
        this.#initDomElements();
        this.#bindDomEventsListeners();
        this.#subscribeToObservables();
    }

    #initDomElements() {
        this.#btnNext = document.querySelector('.fib-next');
        this.#btnReset = document.querySelector('.fib-reset');
        this.#btnPrev = document.querySelector('.fib-prev');
        this.#btnPlayForwards = document.querySelector('.fib-forwards');
        this.#btnPlayBackwards = document.querySelector('.fib-backwards');
        this.#btnStop = document.querySelector('.fib-stop');

        this.#btnsSpeed = document.querySelectorAll('.fib-speed');
    }

    #bindDomEventsListeners() {
        this.#btnNext.addEventListener('click', async () => {
            await this.#fibCanvas.stop();
            this.#fibCanvas.stepForward();
        });

        this.#btnPrev.addEventListener('click', async () => {
            await this.#fibCanvas.stop();
            this.#fibCanvas.stepBackward();
        });

        this.#btnReset.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClass();
            this.#fibCanvas.resetToStart();
        });

        this.#btnPlayForwards.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClass();
            this.#btnPlayForwards.classList.add('btn-radio-active');

            this.#fibCanvas.playForward();
        });

        this.#btnPlayBackwards.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClass();
            this.#btnPlayBackwards.classList.add('btn-radio-active');

            this.#fibCanvas.playBackward();
        });

        this.#btnStop.addEventListener('click', () => {
            this.#fibCanvas.stop();
            this.#removeBtnRadioActiveClass();
        });

        this.#btnsSpeed.forEach((el, i) => {
            el.addEventListener('click', () => {
                this.#btnsSpeed.forEach((el) =>
                    el.classList.remove('btn-outline-active')
                );
                el.classList.add('btn-outline-active');

                this.#fibCanvas.setAnimationSpeedDivider(SPEED_PRESETS[i]);
            });
        });
    }

    #subscribeToObservables() {
        this.#fibCanvas.autoPlayStarted$.subscribe(() => {
            this.#btnNext.disabled = true;
            this.#btnPrev.disabled = true;
        });

        this.#fibCanvas.autoPlayStopped$.subscribe(() => {
            this.#btnNext.disabled = false;
            this.#btnPrev.disabled = false;
        });

        this.#fibCanvas.autoPlayStoppedAtFirstNumber$.subscribe(() => {
            this.#removeBtnRadioActiveClass();
        });
    }

    #removeBtnRadioActiveClass() {
        document
            .querySelectorAll('.btn-radio')
            .forEach((el) => el.classList.remove('btn-radio-active'));
    }
}
