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
        });

        this.#btnPrev.addEventListener('click', async () => {
            this.#setActiveRadioButton(this.#btnPrev);

            await this.#fibCanvas.stop();
            await this.#fibCanvas.stepBackward();

            this.#removeBtnRadioActiveClassForAllButtons(this.#btnPrev);
        });

        this.#btnReset.addEventListener('click', async () => {
            this.#removeBtnRadioActiveClassForAllButtons();
            this.#fibCanvas.resetToStart();
        });

        this.#btnPlayForwards.addEventListener('click', async () => {
            if (
                !this.#isButtonActive(this.#btnPlayForwards) ||
                this.#isButtonPaused(this.#btnPlayForwards)
            ) {
                this.#setActiveRadioButton(this.#btnPlayForwards);
                this.#fibCanvas.playForward();
            } else {
                this.#autoPlayPause(this.#btnPlayForwards);
            }
        });

        this.#btnPlayBackwards.addEventListener('click', async () => {
            if (this.#fibCanvas.isFirstStep) {
                return;
            }

            if (
                !this.#isButtonActive(this.#btnPlayBackwards) ||
                this.#isButtonPaused(this.#btnPlayBackwards)
            ) {
                this.#setActiveRadioButton(this.#btnPlayBackwards);
                this.#fibCanvas.playBackward();
            } else {
                this.#autoPlayPause(this.#btnPlayBackwards);
            }
        });

        this.#btnStop.addEventListener('click', () => {
            this.#fibCanvas.stop();
            this.#removeBtnRadioActiveClassForAllButtons();
        });

        this.#btnsSpeed.forEach((el, i) => {
            el.addEventListener('click', () => {
                this.#btnsSpeed.forEach((el) =>
                    el.classList.remove('btn-outline-active')
                );
                el.classList.add('btn-outline-active');

                this.#fibCanvas.setAnimationSpeedDivider(SPEED_PRESETS[i]);

                const activeAutoPlayBtn = this.#getActiveAutoPlayBtn();
                if (activeAutoPlayBtn) {
                    activeAutoPlayBtn.focus();
                }
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
            this.#removeBtnRadioActiveClassForAllButtons();
        });
    }

    #setActiveRadioButton(btnDomElement) {
        this.#removeBtnRadioActiveClassForAllButtons();
        btnDomElement.classList.add('btn-radio-active');
        btnDomElement.classList.remove('btn-radio-paused');
    }

    #removeBtnRadioActiveClassForAllButtons() {
        document
            .querySelectorAll('.btn-radio')
            .forEach(this.#removeBtnRadioActiveClass);
    }

    #removeBtnRadioActiveClass(domElement) {
        domElement.classList.remove('btn-radio-active', 'btn-radio-paused');
    }

    #autoPlayPause(autoPlayBtn) {
        autoPlayBtn.classList.add('btn-radio-paused');
        this.#fibCanvas.stop();
    }

    #isButtonActive(buttonDomElement) {
        return buttonDomElement.classList.contains('btn-radio-active');
    }

    #isButtonPaused(buttonDomElement) {
        return buttonDomElement.classList.contains('btn-radio-paused');
    }

    #getActiveAutoPlayBtn() {
        return document.querySelector('.btn-auto.btn-radio-active');
    }
}
