const MAX_ANIMATION_SPEED_FLICKERING_MS = 10;

export class FibCanvasAnimation {
    #fibNumDomElements;
    #plusSignDomElement;
    #arrow1DomElement;
    #arrow2DomElement;
    #stepNumDomElement;

    #animationStopped = false;

    constructor(
        fibNumDomElements,
        plusSignDomElement,
        arrow1DomElement,
        arrow2DomElement,
        stepNumDomElement
    ) {
        this.#fibNumDomElements = fibNumDomElements;
        this.#plusSignDomElement = plusSignDomElement;
        this.#arrow1DomElement = arrow1DomElement;
        this.#arrow2DomElement = arrow2DomElement;
        this.#stepNumDomElement = stepNumDomElement;
    }

    async animateBeforeCalculation() {
        this.#animateStepNumProgressForwards();

        await this.#animateHideElements();
        await this.#animateFibNum2SlideLeft();
        await this.#animateFibNum3SlideTopRight();
    }

    async animateAfterCalculation(displayTimePeriod = 0) {
        // TODO: cleanup method
        this.#fibNumDomElements[0].classList.remove('fib-animate-hide');
        this.#fibNumDomElements[1].classList.remove('fib-num-2-slide-left');
        this.#fibNumDomElements[2].classList.remove(
            'fib-num-3-slide-top-right'
        );
        this.#fibNumDomElements[2].classList.add('fib-hidden');

        await this.#animateShow(this.#plusSignDomElement);
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
        this.#stepNumDomElement.classList.remove('step-num-progress-forwards');

        if (displayTimePeriod) {
            await this.#waitATick(displayTimePeriod);
        }
    }

    async animateBackwardsBeforeCalculation() {
        this.#animateStepNumProgressBackwards();

        await this.#animateHide(this.#fibNumDomElements[2]);
        await Promise.all([
            this.#animateHide(this.#arrow1DomElement),
            this.#animateHide(this.#arrow2DomElement),
        ]);
        await this.#animateHide(this.#plusSignDomElement);

        await this.#animateFibNum2SlideBottomLeft();
        await this.#animateFibNum1SlideRight();
    }

    async animateBackwardsAfterCalculation(displayTimePeriod = 0) {
        this.#fibNumDomElements[1].classList.remove(
            'fib-num-2-slide-bottom-left'
        );
        this.#fibNumDomElements[2].classList.remove('fib-animate-hide');

        this.#fibNumDomElements[0].classList.remove('fib-num-1-slide-right');
        this.#fibNumDomElements[0].classList.add('fib-hidden');

        await this.#animateShow(this.#fibNumDomElements[0]);

        await Promise.all([
            this.#animateShow(this.#plusSignDomElement),
            this.#animateShow(this.#arrow1DomElement),
            this.#animateShow(this.#arrow2DomElement),
        ]);

        // clean up classes
        [
            this.#plusSignDomElement,
            this.#arrow1DomElement,
            this.#arrow2DomElement,
            this.#fibNumDomElements[0],
        ].forEach((el) =>
            el.classList.remove(
                'fib-animate-hide',
                'fib-animate-show',
                'fib-hidden'
            )
        );
        this.#stepNumDomElement.classList.remove('step-num-progress-backwards');

        if (displayTimePeriod) {
            await this.#waitATick(displayTimePeriod);
        }
    }

    stopAnimation() {
        this.#animationStopped = true;
    }

    startAnimation() {
        this.#animationStopped = false;
    }

    setAnimationSpeed(animationSpeedInMs) {
        document.documentElement.style.setProperty(
            '--fib-animation-speed',
            `${(animationSpeedInMs / 1000).toFixed(2)}s`
        );

        this.#preventFlickeringAtHighSpeed(animationSpeedInMs);
    }

    #preventFlickeringAtHighSpeed(animationSpeedInMs) {
        if (animationSpeedInMs <= MAX_ANIMATION_SPEED_FLICKERING_MS) {
            document.documentElement.style.setProperty('--fib-opacity-0', 1);
            document.documentElement.style.setProperty('--fib-opacity-1', 1);
            document.documentElement.style.setProperty(
                '--fib-step-progress-bg-size-100',
                '0%'
            );
        } else {
            document.documentElement.style.removeProperty('--fib-opacity-0');
            document.documentElement.style.removeProperty('--fib-opacity-1');
            document.documentElement.style.removeProperty(
                '--fib-step-progress-bg-size-100'
            );
        }
    }

    #animateHideElements() {
        return Promise.all([
            this.#animateHide(this.#fibNumDomElements[0]),
            this.#animateHide(this.#plusSignDomElement),
            this.#animateHide(this.#arrow1DomElement),
            this.#animateHide(this.#arrow2DomElement),
        ]);
    }

    #animateStepNumProgressForwards() {
        this.#applyAnimation(
            this.#stepNumDomElement,
            'step-num-progress-forwards'
        );
    }

    #animateStepNumProgressBackwards() {
        this.#applyAnimation(
            this.#stepNumDomElement,
            'step-num-progress-backwards'
        );
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

    #animateFibNum1SlideRight() {
        return this.#applyAnimation(
            this.#fibNumDomElements[0],
            'fib-num-1-slide-right'
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

    #animateFibNum2SlideBottomLeft() {
        const fibNum2DomElement = this.#fibNumDomElements[1];

        document.documentElement.style.setProperty(
            '--fib-num-2-offset-path',
            this.#getFibNum2OffsetPath(fibNum2DomElement)
        );

        return this.#applyAnimation(
            fibNum2DomElement,
            'fib-num-2-slide-bottom-left'
        );
    }

    #applyAnimation(domElement, animationClass) {
        // Do not apply animation if animation was stopped
        if (this.#animationStopped) {
            return Promise.resolve();
        }

        const animation = new Promise((resolve) => {
            domElement.addEventListener('animationend', resolve, {
                once: true,
            });
        });

        domElement.classList.add(animationClass);

        return animation;
    }

    #waitATick(timeout = 0) {
        if (this.#animationStopped) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            setTimeout(resolve, timeout);
        });
    }

    #getFibNum3OffsetPath(fibNum3DomElement) {
        const width = fibNum3DomElement.offsetWidth;
        const height = fibNum3DomElement.offsetHeight;

        const dX = 64 + width * 0.5;
        const dY = -48 - height;

        return `"M0,${height} c${0.57 * dX},0 ${dX},${dY * 0.42} ${dX},${dY}"`;
    }

    #getFibNum2OffsetPath(fibNum2DomElement) {
        const width = fibNum2DomElement.offsetWidth;
        const height = fibNum2DomElement.offsetHeight;

        const dX = -64 - width * 0.5;
        const dY = 48 + height;

        return `"M${width * 0.5},0 c0,${dY * 0.42} ${
            dX * 0.43
        },${dY} ${dX},${dY}"`;
    }
}
