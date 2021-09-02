const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

const isPromise = value => {
    if ((typeof value === 'object' && value !== null) ||
        typeof value === 'function') {
        return typeof value.then === 'function'
    }
    return false
}

const resolvePromise = (promise2, x, resolve, reject) => {
    if (promise2 === x) {
        return reject(new TypeError(`Chaining cycle detected for promise #<Promise>`))
    }
    if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
        let called
        try {
            /**
             * 取 then 可能会报错
             * let x = {}
             * Object.defineProperty(x, 'then', {
             *     get() {
             *        throw new Error('逗你玩~')
             *     }   
             * })  
             */
            const then = x.then
            if (typeof then === 'function') {
                then.call(x, y => {
                    if (called) return // 防止多次调用
                    called = true
                    // 有可能 y 的值还是 promise 需要进行递归解析
                    resolvePromise(promise2, y, resolve, reject)
                }, r => {
                    if (called) return
                    called = true
                    reject(r)
                })
            } else {
                resolve(x)
            }
        } catch (error) {
            if (called) return
            called = true
            reject(error)
        }
    } else {
        resolve(x)
    }
}

class Promise {
    constructor(executor) {
        this.value = undefined
        this.reason = undefined
        this.status = PENDING
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []

        const resolve = (value) => {
            if (value instanceof Promise) {
                // 如果 resolve 的是一个 promise 那就让这个 promise.then 取得这个 promise 执行器里的 value 或者 reason，再传给初始的 resolve 或者 reject 
                return value.then(resolve, reject)
            }
            if (this.status == PENDING) {
                this.value = value
                this.status = FULFILLED
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if (this.status == PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (error) {
            reject(error)
        }
    }

    then(onFulfilled, onRejected) {
        // 可选参数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : err => {
            throw err
        }
        const promise2 = new Promise((resolve, reject) => {
            if (this.status == FULFILLED) {
                setTimeout(() => {
                    try {
                        const x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                });
            }

            if (this.status == REJECTED) {
                setTimeout(() => {
                    try {
                        const x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                });
            }

            if (this.status == PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    });
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            const x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    });
                })
            }
        })
        return promise2
    }

    catch (errCallback) {
        // 没有成功的 then
        return this.then(null, errCallback)
    }

    static resolve(value) {
        return new Promise((resolve, reject) => {
            resolve(value)
        })
    }

    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    }

    static all(promises) {
        return new Promise((resolve, reject) => {
            let result = []
            let index = 0
            const processData = (loopIndex, data) => {
                result[loopIndex] = data
                if (++index == promises.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < promises.length; i++) {
                const current = promises[i]
                if (isPromise(current)) {
                    current.then(value => {
                        processData(i, value)
                    }, reject)
                } else {
                    processData(i, current)
                }
            }
        })
    }
}

exports.Promise = Promise
exports.isPromise = isPromise

