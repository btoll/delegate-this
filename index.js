// Other objects relative to { my object }
//
//
//       Object.prototype / null
//                 |
//                 |
//             base proto
//                 |
//                 |
//             prev proto
//                 |
//                 |
//            { my object }
//                 |
//                 |
//             next proto
//                 |
//                 |
//                \_/
//
//

// Creating symbols with `.for()` will allow the *same* symbol to be accessed from the
// symbol registry for the entire module.
const __BASE_PROTO__ = Symbol();
const __INIT__       = Symbol.for('__INIT__');
const __SUPER__      = Symbol();

const baseProto = {
    [__BASE_PROTO__]: true,
    super: function () {
        try {
            this.super.caller[__SUPER__].apply(this, arguments);
        } // Catch block should never be called b/c we're not attaching a `__SUPER__`
          // call if the function name isn't found in the prototype chain.
          // See `enableSuper`.  Leave here for now.
        catch (e) {
            throw new Error('[ERROR] No super. Sad!');
        }
    }
};

const create = (proto, /* optional */ fns) => {
    const p = Object.create(proto);

    // Insert `baseProto` between the first user object and the ultimate base
    // (Object.prototype or null).  This is what allows `.super` to be accessed
    // via the prototype chain.
    if (!proto[__BASE_PROTO__]) {
        Object.setPrototypeOf(
            getFirstUserPrototype(proto),
            baseProto
        );
    }

    // Since delegate accepts an optional 2nd arg of an object containing functions
    // to be mixed into the new object, we have to assign super to them, as well.
    if (fns) {
        // This is the 'magic' that allows `this.super` to be called.
        enableSuper(fns, proto);
        Object.assign(p, fns);
    }

    if (p[__INIT__]) {
        p[__INIT__].apply(p);
    }

    return p;
};

const enableSuper = (obj, proto) => {
    // Also get symbols b/c pre-defined ones like __INIT__ may want to call super, too.
    const keys = Object.getOwnPropertySymbols(obj).concat(Object.keys(obj));

    for (let key of keys) {
        const fn = obj[key];

        // Note that we don't need to check if `proto[key]` actually exists since
        // `isFunction` will do this.
        if (
            !fn[__SUPER__] &&
            isFunction(proto[key]) &&
            isFunction(fn)
        ) {
            fn[__SUPER__] = proto[key];
        }
    }
};

// Walk the prototype chain to get the first prototype in user space (the 'base proto'
// in the chain above).
const getFirstUserPrototype = proto => {
    if (isBasePrototype(proto)) {
        return proto;
    }

    return getFirstUserPrototype(Object.getPrototypeOf(proto));
};

const isBasePrototype = proto =>
    Object.getPrototypeOf(proto) === (Object.prototype || null);

const isFunction = fn =>
    Object.prototype.toString.call(fn) === '[object Function]';

//module.exports = create;

