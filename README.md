# delegate-this

[![npm](https://img.shields.io/npm/v/delegate-this.svg)](https://www.npmjs.com/package/delegate-this)

`super` simple object delegation

No classes here.  Use JavaScript as it was intended, i.e., simply objects extending other objects.

The only deviation is that this implementation allows for the use of `this.super(...args)` in any function to call its hidden "parent" function (with or without function arguments).

## Examples

```
const d = require('delegate-this');

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
```

See [another example][1].

## License

[GPLv3](COPYING)

## Author

Benjamin Toll

[1]: ./examples/delegate.js

