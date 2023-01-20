export class FibCanvasAnimation {
    #fibNumDomElements;
    #explanatoryDomElements;

    constructor(fibNumDomElements, explanatoryDomElements) {
        this.#fibNumDomElements = fibNumDomElements;
        this.#explanatoryDomElements = explanatoryDomElements;
    }

    async animateBeforeCalculation() {
        await this.#toggleDomElements();
        await this.#animateFibNum2SlideLeft();
        await this.#animateFibNum3SlideTopRight();

        this.#fibNumDomElements[2].classList.remove(
            'fib-num-3-slide-top-right'
        );
        this.#fibNumDomElements[1].classList.remove('fib-num-2-slide-left');
        this.#toggleDomElements();

        return Promise.resolve();
    }

    #toggleDomElements() {
        return this.#toggleDomElement([
            ...this.#explanatoryDomElements,
            this.#fibNumDomElements[0],
        ]);
    }

    #toggleDomElement(elementOrArray) {
        return Promise.all(
            (Array.isArray(elementOrArray)
                ? elementOrArray
                : [elementOrArray]
            ).map((el) => this.#animateHide(el))
        );
    }

    #animateHide(domElement) {
        const animation = new Promise((resolve, reject) => {
            domElement.addEventListener('animationend', resolve, {
                once: true,
            });
        });

        domElement.classList.toggle('fib-hide');

        return animation;
    }

    #animateFibNum2SlideLeft() {
        const fibNum2DomElement = this.#fibNumDomElements[1];
        const animation = new Promise((resolve) => {
            fibNum2DomElement.addEventListener('animationend', resolve, {
                once: true,
            });
        });

        fibNum2DomElement.classList.add('fib-num-2-slide-left');

        return animation;
    }

    #animateFibNum3SlideTopRight() {
        const fibNum3DomElement = this.#fibNumDomElements[2];

        const animation = new Promise((resolve) => {
            fibNum3DomElement.addEventListener('animationend', resolve, {
                once: true,
            });
        });

        document.documentElement.style.setProperty(
            '--fib-num-3-offset-path',
            this.#getFibNum3OffsetPath(fibNum3DomElement)
        );
        fibNum3DomElement.classList.add('fib-num-3-slide-top-right');

        return animation;
    }

    animateAfterCalculation() {}

    #getFibNum3OffsetPath(fibNum3DomElement) {
        const width = fibNum3DomElement.offsetWidth;
        const height = fibNum3DomElement.offsetHeight;

        const moveX = width * 0.5;
        const moveY = height * 0.5;

        const dY = -48 - height;

        // '"M33,46 c59,0 100,-59 100,-141"'
        return `"M${moveX},${moveY} c37,0 64,${dY * 0.42} 64,${dY}"`;
    }
}
