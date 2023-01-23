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
    }

    async prevNumber() {
        if (this.#stepNumber === 1) {
            return;
        }

        await this.#fibCanvasAnimation.animateBackwardsBeforeCalculation();

        this.#setPrevFibNumbers();

        await this.#fibCanvasAnimation.animateBackwardsAfterCalculation();

        this.#setPrevStepNumber();
    }

    resetToStart() {
        this.#resetNumbers();
        this.#renderFibNumbers();
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

    #resetNumbers() {
        this.#initNumbers();
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
