const add = (a, b, c, d, e) => {
    return a + b + c + d + e
}

const curry = (fn, argsCache = []) => {
    const len = fn.length
    return (...args) => {
        argsCache = argsCache.concat(args)
        if (argsCache.length < len) {
            return curry(fn, argsCache)
        }
        return fn(...argsCache)
    }
}

console.log(curry(add)(1)(2)(3)(4)(5))


const after = (times, fn) => {
    return () => {
        if (--times == 0) {
            fn()
        }
    }
}

let newFn = after(3, () => {
    console.log('3次后执行')
})

newFn();
newFn();
newFn();    