import { fibGenerator } from './FibGenerator.js';

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
        await this.#animate();

        this.#generateNextNumber();
        this.#renderNumbers();
    }

    resetToStart() {
        this.#resetNumbers();
        this.#renderNumbers();
    }

    async #animate() {
        this.#toggleArrows();

        const animation = Promise.all([
            this.#animateFibNum1Hide(),
            this.#animateFibNum2SlideLeft(),
            this.#animateFibNum3SlideTopRight(),
        ]).then(() => this.#toggleArrows());

        return animation;
    }

    #toggleArrows() {
        this.#arrowDomElements.forEach((el) => el.classList.toggle('fib-hide'));
    }

    #animateFibNum1Hide() {
        const fibNum1DomElement = this.#fibNumDomElements[0];

        const animation = new Promise((resolve, reject) => {
            fibNum1DomElement.addEventListener(
                'animationend',
                () => {
                    fibNum1DomElement.classList.remove('fib-hide');
                    resolve();
                },
                { once: true }
            );
        });

        fibNum1DomElement.classList.add('fib-hide');

        return animation;
    }

    #animateFibNum2SlideLeft() {
        const fibNum2DomElement = this.#fibNumDomElements[1];
        const animation = new Promise((resolve, reject) => {
            fibNum2DomElement.addEventListener(
                'animationend',
                () => {
                    fibNum2DomElement.classList.remove('fib-num-2-slide-left');
                    resolve();
                },
                { once: true }
            );
        });

        fibNum2DomElement.classList.add('fib-num-2-slide-left');

        return animation;
    }

    #animateFibNum3SlideTopRight() {
        const fibNum3DomElement = this.#fibNumDomElements[2];

        const animation = new Promise((resolve, reject) => {
            fibNum3DomElement.addEventListener(
                'animationend',
                () => {
                    fibNum3DomElement.classList.remove(
                        'fib-num-3-slide-top-right'
                    );
                    // fibNum3DomElement.classList.add('fib-hidden');
                    resolve();
                },
                { once: true }
            );
        });

        fibNum3DomElement.classList.add('fib-num-3-slide-top-right');

        return animation;
    }

    #initDomElements() {
        for (let i = 1; i <= 3; i++) {
            this.#fibNumDomElements.push(
                document.querySelector(`.fib-num-${i}`)
            );
        }

        this.#fibStepNumDomElement = document.querySelector('.step-num');
        this.#arrowDomElements = document.querySelectorAll('.arrow');
    }

    #initNumbers() {
        this.#stepNum = 1;
        this.#fibGenerator = fibGenerator();
        this.#fibNumbers = [];
        for (let i = 1; i <= 3; i++) {
            this.#fibNumbers.push(this.#fibGenerator.next().value);
        }
    }

    #generateNextNumber() {
        this.#stepNum++;
        this.#fibNumbers.shift();
        this.#fibNumbers.push(this.#fibGenerator.next().value);
    }

    #renderNumbers() {
        this.#fibNumbers.forEach((number, index) => {
            this.#fibNumDomElements[index].querySelector(
                '.fib-num-value'
            ).innerHTML = this.#formatNumber(number);
        });

        this.#fibStepNumDomElement.innerHTML = `${this.#formatNumber(
            this.#stepNum
        )}.`;
    }

    #formatNumber(num) {
        return this.#numberFormatter.format(num);
    }

    #resetNumbers() {
        this.#initNumbers();
    }
}
