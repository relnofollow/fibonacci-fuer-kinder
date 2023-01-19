export class FibonacciGenerator {
    #fib1 = 0;
    #fib2 = 1;

    constructor() {}

    *[Symbol.iterator]() {
        yield this.#fib1;
        yield this.#fib2;

        while (true) {
            const next = this.#fib1 + this.#fib2;
            this.#fib1 = this.#fib2;
            this.#fib2 = next;

            yield next;
        }
    }
}
