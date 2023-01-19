import { FibonacciGenerator } from './FibonacciGenerator.js';

class FibCanvas {
    #fibDomElements = [];
    #fibGenerator;
    #fibNumbers = [];
    #numberFormatter;

    constructor() {
        this.#initNumbers();
        this.#initDomElements();

        this.#numberFormatter = new Intl.NumberFormat('de-DE', {});
    }

    nextNumber() {
        this.#generateNextNumber();
        this.#renderNumbers();
    }

    resetToStart() {
        this.#resetNumbers();
        this.#renderNumbers();
    }

    #initDomElements() {
        for (let i = 1; i <= 3; i++) {
            this.#fibDomElements.push(document.querySelector(`.fib-${i}`));
        }
    }

    #initNumbers() {
        this.#fibGenerator = new FibonacciGenerator();
        this.#fibNumbers = [];
        this.#fibNumbers.push(...[0, 1, this.#fibGenerator.next()]); // TODO: get all of these numbers from the generator
    }

    #generateNextNumber() {
        this.#fibNumbers.shift();
        this.#fibNumbers.push(this.#fibGenerator.next());
    }

    #renderNumbers() {
        this.#fibNumbers.forEach((number, index) => {
            this.#fibDomElements[index].innerHTML = this.#formatNumber(number);
        });
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }

    #resetNumbers() {
        this.#initNumbers();
    }
}

(function () {
    const fibCanvas = new FibCanvas();

    const btnNext = document.querySelector('.fib-next');
    const btnReset = document.querySelector('.fib-reset');

    btnNext.addEventListener('click', () => fibCanvas.nextNumber());
    btnReset.addEventListener('click', () => fibCanvas.resetToStart());

    fibCanvas.nextNumber();
})();
