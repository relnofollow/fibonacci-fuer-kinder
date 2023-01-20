export class FibCanvasAnimation {
    #fibNumDomElements;
    #arrowDomElements;

    constructor(fibNumDomElements, arrowDomElements) {
        this.#fibNumDomElements = fibNumDomElements;
        this.#arrowDomElements = arrowDomElements;
    }

    animateBeforeCalculation() {
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

    animateAfterCalculation() {}
}
