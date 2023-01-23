import { FibGenerator } from './FibGenerator.js';
import { FibCanvasAnimation } from './FibCanvasAnimation.js';

export class FibCanvas {
    #fibNumDomElements = [];
    #fibStepNumDomElement = [];
    #plusSignDomElement;
    #arrow1DomElement;
    #arrow2DomElement;

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
        const fibCanvasAnimation = new FibCanvasAnimation(
            this.#fibNumDomElements,
            this.#plusSignDomElement,
            this.#arrow1DomElement,
            this.#arrow2DomElement
        );

        this.#setNextStepNumber();

        await fibCanvasAnimation.animateBeforeCalculation();

        this.#setNextFibNumbers();

        await fibCanvasAnimation.animateAfterCalculation();
    }

    async prevNumber() {
        if (this.#stepNumber === 1) {
            return;
        }

        this.#setPrevStepNumber();
        this.#setPrevFibNumbers();
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
        this.#fibStepNumDomElement.innerHTML = `${this.#formatNumber(
            this.#stepNumber
        )}.`;
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }
}
