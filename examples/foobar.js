const d = require('../index');

const base = {
    derp() {
        console.log('i am derp');
    },
    sum(list) {
        console.log(
            list.reduce((acc, curr) => (
                acc += curr, acc
            ))
        );
    }
};

const foo = d.create(base, {
    derp() {
        console.log('foo');
        this.super();
    },
    herp() {
        console.log('i am herp');
    }
});

const bar = d.create(foo, {
    derp() {
        console.log('bar');
        this.super();
    },
    sum(...list) {
        // do stuff
        this.super(list);
    }
});

bar.derp(); // 'bar', 'foo', 'i am derp'
bar.herp(); // 'i am herp'
bar.sum(5, 10, 15, 20); // 50

