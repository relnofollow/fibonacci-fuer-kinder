export class FibModal {
    #modalDomElement;
    #btnsClose;

    constructor() {
        this.#initDomElements();
        this.#bindDomEventsListeners();
    }

    show() {
        this.#modalDomElement.style.display = 'block';
        document.body.classList.add('modal-open');
    }

    hide() {
        this.#modalDomElement.style.display = 'none';
        document.body.classList.remove('modal-open');
    }

    #initDomElements() {
        this.#modalDomElement = document.querySelector('.modal');
        this.#btnsClose = this.#modalDomElement.querySelectorAll('.fib-close');
    }

    #bindDomEventsListeners() {
        this.#btnsClose.forEach((el) =>
            el.addEventListener('click', () => this.hide())
        );

        document.addEventListener('click', (event) => {
            if (event.target == this.#modalDomElement) {
                this.hide();
            }
        });
    }
}
