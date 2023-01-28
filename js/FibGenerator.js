export class FibGenerator {
    #numbers;

    constructor() {}

    next() {
        if (!this.#numbers) {
            this.#numbers = [0n, 1n, 1n];
            return this.#numbers;
        }

        this.#numbers.shift();
        this.#numbers.push(this.#numbers.at(-1) + this.#numbers.at(-2));

        return this.#numbers;
    }

    prev() {
        if (this.#numbers[0] === 0) {
            return this.#numbers;
        }

        this.#numbers.pop();
        this.#numbers.unshift(this.#numbers[1] - this.#numbers[0]);

        return this.#numbers;
    }

    reset() {
        this.#numbers = null;
    }
}
