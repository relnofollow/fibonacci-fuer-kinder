export function* fibGenerator() {
    let fib1 = 0;
    let fib2 = 1;

    yield 0;
    yield 1;

    while (true) {
        const next = fib1 + fib2;
        fib1 = fib2;
        fib2 = next;

        yield next;
    }
}
