export class FibCanvasAnimation {
    #fibNumDomElements;
    #plusSignDomElement;
    #arrow1DomElement;
    #arrow2DomElement;

    constructor(
        fibNumDomElements,
        plusSignDomElement,
        arrow1DomElement,
        arrow2DomElement
    ) {
        this.#fibNumDomElements = fibNumDomElements;
        this.#plusSignDomElement = plusSignDomElement;
        this.#arrow1DomElement = arrow1DomElement;
        this.#arrow2DomElement = arrow2DomElement;
    }

    async animateBeforeCalculation() {
        await this.#animateHideElements();
        await this.#animateFibNum2SlideLeft();
        await this.#animateFibNum3SlideTopRight();

        return Promise.resolve();
    }

    async animateAfterCalculation() {
        // TODO: cleanup method
        this.#fibNumDomElements[0].classList.remove('fib-animate-hide');
        this.#fibNumDomElements[1].classList.remove('fib-num-2-slide-left');
        this.#fibNumDomElements[2].classList.remove(
            'fib-num-3-slide-top-right'
        );
        this.#fibNumDomElements[2].classList.add('fib-hidden');

        // animate '+'
        await this.#animateShow(this.#plusSignDomElement);
        // animate arrows
        await Promise.all([
            this.#animateShow(this.#arrow1DomElement),
            this.#animateShow(this.#arrow2DomElement),
        ]);
        // animate sum
        await this.#applyAnimation(
            this.#fibNumDomElements[2],
            'fib-num-3-animate-show'
        );

        // clean up classes
        [
            this.#plusSignDomElement,
            this.#arrow1DomElement,
            this.#arrow2DomElement,
        ].forEach((el) =>
            el.classList.remove('fib-animate-hide', 'fib-animate-show')
        );
        this.#fibNumDomElements[2].classList.remove(
            'fib-hidden',
            'fib-num-3-animate-show'
        );
    }

    #animateHideElements() {
        return Promise.all([
            this.#animateHide(this.#fibNumDomElements[0]),
            this.#animateHide(this.#plusSignDomElement),
            this.#animateHide(this.#arrow1DomElement),
            this.#animateHide(this.#arrow2DomElement),
        ]);
    }

    async #animateHide(domElement) {
        await this.#applyAnimation(domElement, 'fib-animate-hide');
    }

    async #animateShow(domElement) {
        await this.#applyAnimation(domElement, 'fib-animate-show');
    }

    #animateFibNum2SlideLeft() {
        return this.#applyAnimation(
            this.#fibNumDomElements[1],
            'fib-num-2-slide-left'
        );
    }

    #animateFibNum3SlideTopRight() {
        const fibNum3DomElement = this.#fibNumDomElements[2];

        document.documentElement.style.setProperty(
            '--fib-num-3-offset-path',
            this.#getFibNum3OffsetPath(fibNum3DomElement)
        );

        return this.#applyAnimation(
            fibNum3DomElement,
            'fib-num-3-slide-top-right'
        );
    }

    #applyAnimation(domElement, animationClass) {
        const animation = new Promise((resolve) => {
            domElement.addEventListener('animationend', resolve, {
                once: true,
            });
        });

        domElement.classList.add(animationClass);

        return animation;
    }

    #getFibNum3OffsetPath(fibNum3DomElement) {
        const width = fibNum3DomElement.offsetWidth;
        const height = fibNum3DomElement.offsetHeight;

        const dX = 64 + width * 0.5;
        const dY = -48 - height;

        // '"M0,0 c59,0 100,-59 100,-141"'
        return `"M0,${height} c${0.57 * dX},0 ${dX},${dY * 0.42} ${dX},${dY}"`;
    }
}
