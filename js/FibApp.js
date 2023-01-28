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
            this.#setActiveRadioButton(this.#btnNext);

            await this.#fibCanvas.stop();
            await this.#fibCanvas.stepForward();

            this.#removeBtnRadioActiveClass(this.#btnNext);

            this.#blurActiveElement();
        });

        this.#btnPrev.addEventListener('click', async () => {
            this.#setActiveRadioButton(this.#btnPrev);

            await this.#fibCanvas.stop();
            await this.#fibCanvas.stepBackward();

            this.#removeBtnRadioActiveClassForAllButtons(this.#btnPrev);

            this.#blurActiveElement();
        });

        this.#btnReset.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClassForAllButtons();
            this.#fibCanvas.resetToStart();

            this.#blurActiveElement();
        });

        this.#btnPlayForwards.addEventListener('click', async () => {
            this.#setActiveRadioButton(this.#btnPlayForwards);
            this.#fibCanvas.playForward();

            this.#blurActiveElement();
        });

        this.#btnPlayBackwards.addEventListener('click', async () => {
            this.#setActiveRadioButton(this.#btnPlayBackwards);
            this.#fibCanvas.playBackward();

            this.#blurActiveElement();
        });

        this.#btnStop.addEventListener('click', () => {
            this.#fibCanvas.stop();
            this.#removeBtnRadioActiveClassForAllButtons();

            this.#blurActiveElement();
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

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                var clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                this.#btnStop.dispatchEvent(clickEvent);
            }
        });
    }

    #blurActiveElement() {
        document.activeElement.blur();
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
            this.#removeBtnRadioActiveClassForAllButtons();
        });
    }

    #setActiveRadioButton(btnDomElement) {
        this.#removeBtnRadioActiveClassForAllButtons();
        btnDomElement.classList.add('btn-radio-active');
    }

    #removeBtnRadioActiveClassForAllButtons() {
        document
            .querySelectorAll('.btn-radio')
            .forEach((el) => el.classList.remove('btn-radio-active'));
    }

    #removeBtnRadioActiveClass(domElement) {
        domElement.classList.remove('btn-radio-active');
    }
}
