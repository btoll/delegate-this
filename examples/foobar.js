//const d = require('../index');

const base = {
    derp() {
        console.log('i am derp');
    },
    herp() {
        console.log('i am herp');
    },
    sum(list) {
        console.log(
            list.reduce((acc, curr) => (
                acc += curr, acc
            ))
        );
    }
};

const foo = create(base, {
    derp() {
        console.log('foo');
        this.super();
    }
});

const bar = create(foo, {
    derp() {
        console.log('bar');
        this.super();
    },
    sum(...list) {
        // do stuff
        this.super(list);
    }
});

const quux = create(bar, {
    [Symbol.for('__INIT__')]: () => console.log('init `quux` object'),
    herp() {
        console.log('herp');
        this.super();
    }
});

bar.derp(); // 'bar', 'foo', 'i am derp'
bar.herp(); // 'i am herp'
bar.sum(5, 10, 15, 20); // 50
quux.herp();

