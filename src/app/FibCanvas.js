import { FibGenerator } from './FibGenerator.js';
import { FibCanvasAnimation } from './FibCanvasAnimation.js';
import { Subject, tap, firstValueFrom } from 'rxjs';

const DISPLAY_TIME_PERIOD_MS = 1000;
const ANIMATION_STEP_TIME_PERIOD_MS = 500;

export class FibCanvas {
    #fibNumDomElements = [];
    #fibStepNumDomElement = [];
    #plusSignDomElement;
    #arrow1DomElement;
    #arrow2DomElement;

    #fibCanvasAnimation;
    #fibGenerator;
    #stepNumber;
    #fibNumbers = [];
    #numberFormatter = new Intl.NumberFormat(document.documentElement.lang, {});

    #autoPlay;
    #animationSpeedDivider;
    #animationInProgress;

    stepChanged$ = new Subject();
    autoPlayStarted$ = new Subject();
    autoPlayStopped$ = new Subject();
    animationStarted$ = new Subject();
    animationStopped$ = new Subject();
    autoPlayStoppedAtFirstNumber$ = new Subject();

    constructor() {
        this.#initDomElements();
        this.#initNumbers();
        this.#renderFibNumbers();
        this.setAnimationSpeedDivider(1);
    }

    get stepNumber() {
        return this.#stepNumber;
    }

    get autoPlay() {
        return this.#autoPlay;
    }

    get isFirstStep() {
        return this.#stepNumber === 1;
    }

    async stepForward() {
        await this.stop();
        await this.#waitATick();

        await this.#nextNumber();
    }

    async stepBackward() {
        if (this.isFirstStep) {
            return;
        }

        await this.stop();
        await this.#waitATick();

        await this.#prevNumber();
    }

    async playForward() {
        await this.#stopAfterAnimationIsComplete();
        await this.#waitATick();

        this.#autoPlay = true;
        this.autoPlayStarted$.next(true);

        while (this.#autoPlay) {
            await this.#nextNumber(
                ANIMATION_STEP_TIME_PERIOD_MS / this.#animationSpeedDivider,
                DISPLAY_TIME_PERIOD_MS / this.#animationSpeedDivider
            );
        }

        this.autoPlayStopped$.next(true);
    }

    async playBackward() {
        await this.#stopAfterAnimationIsComplete();
        await this.#waitATick();

        if (this.isFirstStep) {
            return;
        }

        this.#autoPlay = true;
        this.autoPlayStarted$.next(true);

        while (this.#autoPlay && !this.isFirstStep) {
            await this.#prevNumber(
                ANIMATION_STEP_TIME_PERIOD_MS / this.#animationSpeedDivider,
                DISPLAY_TIME_PERIOD_MS / this.#animationSpeedDivider
            );
        }

        if (this.isFirstStep) {
            this.#autoPlay = false;
            this.autoPlayStoppedAtFirstNumber$.next(true);
        }

        this.autoPlayStopped$.next(true);
    }

    async stop() {
        if (!this.#animationInProgress) {
            return Promise.resolve();
        }

        if (this.#autoPlay) {
            this.#autoPlay = false;
        }

        // TODO: stop animation immediately
        this.#fibCanvasAnimation.stopAnimation();

        const animationStopped$ = this.animationStopped$.pipe(
            tap(() => this.#fibCanvasAnimation.startAnimation())
        );

        await firstValueFrom(animationStopped$);
    }

    async resetToStart() {
        if (this.isFirstStep) {
            return;
        }

        await this.stop();

        this.#initNumbers();
        this.#renderStepNumber();
        this.#renderFibNumbers();
    }

    setAnimationSpeedDivider(divider) {
        this.#animationSpeedDivider = divider;
    }

    async #stopAfterAnimationIsComplete() {
        if (!this.#animationInProgress) {
            return Promise.resolve();
        }

        if (this.#autoPlay) {
            this.#autoPlay = false;
        }

        await firstValueFrom(this.animationStopped$);
    }

    async #nextNumber(
        animationSpeed = ANIMATION_STEP_TIME_PERIOD_MS,
        displayTimePeriod = 0
    ) {
        this.#fibCanvasAnimation.setAnimationSpeed(animationSpeed);

        this.#setAnimationInProgress(true);

        this.#setNextStepNumber();

        await this.#fibCanvasAnimation.animateBeforeCalculation();

        this.#setNextFibNumbers();

        await this.#fibCanvasAnimation.animateAfterCalculation(
            displayTimePeriod
        );

        this.#setAnimationInProgress(false);
    }

    async #prevNumber(
        animationSpeed = ANIMATION_STEP_TIME_PERIOD_MS,
        displayTimePeriod = 0
    ) {
        this.#fibCanvasAnimation.setAnimationSpeed(animationSpeed);

        this.#setAnimationInProgress(true);

        await this.#fibCanvasAnimation.animateBackwardsBeforeCalculation();

        this.#setPrevFibNumbers();

        await this.#fibCanvasAnimation.animateBackwardsAfterCalculation(
            displayTimePeriod
        );

        this.#setPrevStepNumber();

        this.#setAnimationInProgress(false);
    }

    async #waitATick(timeout = 0) {
        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    #setAnimationInProgress(inProgress) {
        this.#animationInProgress = inProgress;

        if (inProgress) {
            this.animationStarted$.next(true);
        } else {
            this.animationStopped$.next(true);
        }
    }

    #initDomElements() {
        this.#fibNumDomElements = document.querySelectorAll('.fib-num');
        this.#plusSignDomElement = document.querySelector('.fib-sign');
        this.#arrow1DomElement = document.querySelector('.fib-arrow-left');
        this.#arrow2DomElement = document.querySelector('.fib-arrow-right');
        this.#fibStepNumDomElement = document.querySelector('.step-num');

        this.#fibCanvasAnimation = new FibCanvasAnimation(
            this.#fibNumDomElements,
            this.#plusSignDomElement,
            this.#arrow1DomElement,
            this.#arrow2DomElement,
            this.#fibStepNumDomElement
        );
    }

    #initNumbers() {
        this.#stepNumber = 1;
        this.#fibGenerator = new FibGenerator();
        this.#fibNumbers = this.#fibGenerator.next();

        this.stepChanged$.next(this.#stepNumber);
    }

    #setNextStepNumber() {
        this.#stepNumber++;
        this.#renderStepNumber();

        this.stepChanged$.next(this.#stepNumber);
    }

    #setPrevStepNumber() {
        this.#stepNumber--;
        this.#renderStepNumber();

        this.stepChanged$.next(this.#stepNumber);
    }

    #setNextFibNumbers() {
        this.#generateNextFibNumber();
        this.#renderFibNumbers();
    }

    #setPrevFibNumbers() {
        this.#generatePrevFibNumber();
        this.#renderFibNumbers();
    }

    #generateNextFibNumber() {
        this.#fibNumbers = this.#fibGenerator.next();
    }

    #generatePrevFibNumber() {
        this.#fibNumbers = this.#fibGenerator.prev();
    }

    #renderFibNumbers() {
        this.#fibNumbers.forEach((number, index) =>
            this.#renderFibNumber(index)
        );
    }

    #renderFibNumber(index) {
        this.#fibNumDomElements[index].querySelector(
            '.fib-num-value'
        ).innerHTML = this.#formatNumber(this.#fibNumbers[index]);
    }

    #renderStepNumber() {
        this.#fibStepNumDomElement.querySelector(
            '.step-num-value'
        ).innerHTML = `${this.#formatNumber(this.#stepNumber)}`;
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }
}
