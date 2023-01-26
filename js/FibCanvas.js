import { FibGenerator } from './FibGenerator.js';
import { FibCanvasAnimation } from './FibCanvasAnimation.js';

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
    #numberFormatter = new Intl.NumberFormat('de-DE', {});
    #autoPlay;
    #animationInProgress = false;

    stepChanged$ = new rxjs.Subject();
    autoPlayStarted$ = new rxjs.Subject();
    autoPlayStopped$ = new rxjs.Subject();
    animationStarted$ = new rxjs.Subject();
    animationStopped$ = new rxjs.Subject();
    autoPlayStoppedAtFirstNumber$ = new rxjs.Subject();

    constructor() {
        this.#initDomElements();
        this.#initNumbers();
        this.#renderFibNumbers();
    }

    get stepNumber() {
        return this.#stepNumber;
    }

    get autoPlay() {
        return this.#autoPlay;
    }

    async stepForward() {
        await this.stop();
        await this.#tick();

        this.#nextNumber();
    }

    async stepBackward() {
        if (this.#isFirstNumber) {
            return;
        }

        await this.stop();
        await this.#tick();

        this.#prevNumber();
    }

    async playForward(speed = 1) {
        await this.#stopAfterAnimationIsComplete();
        await this.#tick();

        this.#autoPlay = true;
        this.autoPlayStarted$.next(true);

        while (this.#autoPlay) {
            await this.#nextNumber();
            await this.#tick(); // Make a pause to reset step progress animation between iterations
        }

        this.autoPlayStopped$.next(true);
    }

    async playBackward(speed = 1) {
        await this.#stopAfterAnimationIsComplete();
        await this.#tick();

        if (this.#isFirstNumber) {
            return;
        }

        this.#autoPlay = true;
        this.autoPlayStarted$.next(true);

        while (this.#autoPlay && !this.#isFirstNumber) {
            await this.#prevNumber();
            await this.#tick(); // Make a pause to reset step progress animation between iterations
        }

        if (this.#isFirstNumber) {
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
            rxjs.tap(() => this.#fibCanvasAnimation.startAnimation())
        );

        await rxjs.firstValueFrom(animationStopped$);
    }

    async resetToStart() {
        if (this.#isFirstNumber) {
            return;
        }

        await this.stop();

        this.#initNumbers();
        this.#renderStepNumber();
        this.#renderFibNumbers();
    }

    get #isFirstNumber() {
        return this.#stepNumber === 1;
    }

    async #stopAfterAnimationIsComplete() {
        if (!this.#animationInProgress) {
            return Promise.resolve();
        }

        if (this.#autoPlay) {
            this.#autoPlay = false;
        }

        await rxjs.firstValueFrom(this.animationStopped$);
    }

    async #nextNumber() {
        this.#setAnimationInProgress(true);

        this.#setNextStepNumber();

        await this.#fibCanvasAnimation.animateBeforeCalculation();

        this.#setNextFibNumbers();

        await this.#fibCanvasAnimation.animateAfterCalculation();

        this.#setAnimationInProgress(false);
    }

    async #prevNumber() {
        this.#setAnimationInProgress(true);

        await this.#fibCanvasAnimation.animateBackwardsBeforeCalculation();

        this.#setPrevFibNumbers();

        await this.#fibCanvasAnimation.animateBackwardsAfterCalculation();

        this.#setPrevStepNumber();

        this.#setAnimationInProgress(false);
    }

    async #tick() {
        return new Promise((resolve) => {
            setTimeout(resolve, 0);
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
        ).innerHTML = `${this.#formatNumber(this.#stepNumber)}.`;
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }
}
