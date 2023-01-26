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

    $stepComplete = new rxjs.Subject();

    constructor() {
        this.#initDomElements();
        this.#initNumbers();
        this.#renderFibNumbers();
    }

    async nextNumber() {
        this.#setNextStepNumber();

        await this.#fibCanvasAnimation.animateBeforeCalculation();

        this.#setNextFibNumbers();

        await this.#fibCanvasAnimation.animateAfterCalculation();

        this.$stepComplete.next(true);
    }

    async prevNumber() {
        if (this.#stepNumber === 1) {
            this.$stepComplete.next(true);
            return;
        }

        await this.#fibCanvasAnimation.animateBackwardsBeforeCalculation();

        this.#setPrevFibNumbers();

        await this.#fibCanvasAnimation.animateBackwardsAfterCalculation();

        this.#setPrevStepNumber();

        this.$stepComplete.next(true);
    }

    async playForwards(speed = 1) {
        this.autoplay = true;

        while (this.autoplay) {
            await this.nextNumber();
            await this.#tick(); // Make a pause to reset step progress animation between iterations
        }
    }

    async playBackwards(speed = 1) {
        this.autoplay = true;

        while (this.autoplay && this.#stepNumber > 1) {
            await this.prevNumber();
            await this.#tick(); // Make a pause to reset step progress animation between iterations
        }
    }

    // TODO: stop animation immediately
    async stop() {
        if (!this.autoplay) {
            return Promise.resolve();
        }

        this.autoplay = false;

        this.#fibCanvasAnimation.stopAnimation();

        const $stepComplete = this.$stepComplete.pipe(
            rxjs.tap(() => this.#fibCanvasAnimation.startAnimation())
        );

        await rxjs.firstValueFrom($stepComplete);
    }

    resetToStart() {
        this.#initNumbers();
        this.#renderStepNumber();
        this.#renderFibNumbers();
    }

    async #tick() {
        return new Promise((resolve) => {
            setTimeout(resolve, 0);
        });
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
    }

    #setNextStepNumber() {
        this.#stepNumber++;
        this.#renderStepNumber();
    }

    #setPrevStepNumber() {
        this.#stepNumber--;
        this.#renderStepNumber();
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
