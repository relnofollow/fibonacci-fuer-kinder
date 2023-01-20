import { fibGenerator } from './FibGenerator.js';
import { FibCanvasAnimation } from './FibCanvasAnimation.js';

export class FibCanvas {
    #fibNumDomElements = [];
    #fibStepNumDomElement = [];
    #explanatoryDomElements = [];

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
            this.#explanatoryDomElements
        );

        this.#updateStepNumber();

        await fibCanvasAnimation.animateBeforeCalculation();

        this.#updateFibNumbers();

        // await fibCanvasAnimation.animateAfterCalculation();
    }

    resetToStart() {
        this.#resetNumbers();
        this.#renderFibNumbers();
    }

    #initDomElements() {
        this.#fibNumDomElements = document.querySelectorAll('.fib-num');
        this.#explanatoryDomElements = document.querySelectorAll(
            '.fib-arrow, .fib-sign'
        );
        this.#fibStepNumDomElement = document.querySelector('.step-num');
    }

    #initNumbers() {
        this.#stepNumber = 1;
        this.#fibGenerator = fibGenerator();
        this.#fibNumbers = [];
        for (let i = 1; i <= 3; i++) {
            this.#fibNumbers.push(this.#fibGenerator.next().value);
        }
    }

    #resetNumbers() {
        this.#initNumbers();
    }

    #updateStepNumber() {
        this.#stepNumber++;
        this.#renderStepNumber();
    }

    #updateFibNumbers() {
        this.#generateNextFibNumber();
        this.#renderFibNumbers();
    }

    #generateNextFibNumber() {
        this.#fibNumbers.shift();
        this.#fibNumbers.push(this.#fibGenerator.next().value);
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
