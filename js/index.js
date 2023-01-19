import { fibonacciGenerator } from './FibonacciGenerator.js';

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
            this.#fibDomElements.push(document.querySelector(`.fib-num-${i}`));
        }
    }

    #initNumbers() {
        this.#fibGenerator = fibonacciGenerator();
        this.#fibNumbers = [];
        for (let i = 1; i <= 3; i++) {
            this.#fibNumbers.push(this.#fibGenerator.next().value);
        }
    }

    #generateNextNumber() {
        this.#fibNumbers.shift();
        this.#fibNumbers.push(this.#fibGenerator.next().value);
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
