import { fibGenerator } from './FibGenerator.js';
import { FibCanvasAnimation } from './FibCanvasAnimation.js';

export class FibCanvas {
    #fibNumDomElements = [];
    #fibStepNumDomElement = [];
    #arrowDomElements = [];

    #fibGenerator;
    #stepNum;
    #fibNumbers = [];
    #numberFormatter = new Intl.NumberFormat('de-DE', {});

    constructor() {
        this.#initDomElements();
        this.#initNumbers();
        this.#renderNumbers();
    }

    async nextNumber() {
        const fibCanvasAnimation = new FibCanvasAnimation(
            this.#fibNumDomElements,
            this.#arrowDomElements
        );

        await fibCanvasAnimation.animateBeforeCalculation();

        this.#generateNextNumber();
        this.#renderNumbers();

        // await fibCanvasAnimation.animateAfterCalculation();
    }

    resetToStart() {
        this.#resetNumbers();
        this.#renderNumbers();
    }

    #initDomElements() {
        this.#fibNumDomElements = document.querySelectorAll('.fib-num');

        this.#arrowDomElements = document.querySelectorAll('.arrow');
        this.#fibStepNumDomElement = document.querySelector('.step-num');
    }

    #initNumbers() {
        this.#stepNum = 1;
        this.#fibGenerator = fibGenerator();
        this.#fibNumbers = [];
        for (let i = 1; i <= 3; i++) {
            this.#fibNumbers.push(this.#fibGenerator.next().value);
        }
    }

    #resetNumbers() {
        this.#initNumbers();
    }

    #generateNextNumber() {
        this.#stepNum++;
        this.#fibNumbers.shift();
        this.#fibNumbers.push(this.#fibGenerator.next().value);
    }

    #renderNumbers() {
        this.#fibNumbers.forEach((number, index) =>
            this.#renderFibNumber(index)
        );

        this.#renderStepNumber();
    }

    #renderFibNumber(index) {
        this.#fibNumDomElements[index].querySelector(
            '.fib-num-value'
        ).innerHTML = this.#formatNumber(this.#fibNumbers[index]);
    }

    #renderStepNumber() {
        this.#fibStepNumDomElement.innerHTML = `${this.#formatNumber(
            this.#stepNum
        )}.`;
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }
}
