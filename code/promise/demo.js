/**
 * 1. 解决并发问题（同步多个异步的执行结果）
 * 2. 链式调用问题，解决多个回调嵌套的问题
 */

/**
 * 1. 类
 * 2. 每次 new 一个 Promise 都需要传递一个执行器，执行器是立即执行的
 * 3. 执行器函数中有两个参数 resolve , reject
 * 4. 默认 Promise 有三个状态 pending => fulfilled => rejected
 * 5. Promise 状态一旦成功了就不能变成失败，一旦失败了就不能变成成功，只有 pending 时才可以更改状态
 * 6. 每个 Promise 实例都有一个 then 方法
 */

const {
    Promise,
    isPromise
} = require('./Promise')
const fs = require('fs').promises
// console.log(Promise, isPromise)

function * read(){
    yield 1
    yield 2
    yield 3
}

const it = read();
console.log(it.next())
console.log(it.next())
console.log(it.next())

// const isPromise = value => {
//     if ((typeof value === 'object' && value !== null) ||
//         typeof value === 'function') {
//         return typeof value.then === 'function'
//     }
//     return false
// }

// Promise.all = function (promises) {
//     return new Promise((resolve, reject) => {
//         const result = []
//         let index = 0
//         const processData = (loopIndex, data) => {
//             result[loopIndex] = data
//             if (++index == promises.length) {
//                 resolve(result)
//             }
//         }
//         for (let i = 0; i < promises.length; i++) {
//             const current = promises[i]
//             if (isPromise(current)) {
//                 current.then(value => {
//                     processData(i, value)
//                 }, reject)
//             } else {
//                 processData(i, current)
//             }
//         }
//     })
// }

Promise
    .all([fs.readFile('./code/age.txt', 'utf-8'), fs.readFile('./code/name.txt', 'utf-8')])
    .then(value => {
        console.log(value)
    }).catch(err => {
        console.log(err)
    })


// const p = new Promise((resolve, reject) => {
//     resolve(true)
// })

// p.then(null, null).then(value => {
//     console.log(value)
// })

// const p = new Promise((resolve, reject) => {
//     throw new Error('error11')
// })

// p.catch(err => {
//     console.log(err)
// })

// Promise.resolve(true).then(value => {
//     console.log(value)
// }, err => {
//     console.log(err)
// })

// const p = new Promise((resolve, reject) => {
//     setTimeout(() => {
//         resolve(true)
//     }, 1000)
// })

// p.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)
// })

// p.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)
// })

// p.then(res => {
//     console.log(res)
// }, err => {
//     console.log(err)
// })

// const fs = require('fs')
// const path = require('path')

// function readFile(...args) {
//     return new Promise((resolve, reject) => {
//         fs.readFile(...args, (err, data) => {
//             if (err) reject(err)
//             resolve(data)
//         })
//     })
// }

// readFile(path.resolve(__dirname, '../name.txt'), 'utf-8')
//     .then(res => {
//         return readFile(path.resolve(__dirname, `../${res}`), 'utf-8')
//     }, err => {
//         console.log(err)
//     })
//     .then(res => {
//         console.log(res)
//     })

// const p1 = new Promise((resolve, reject) => {
//     resolve(true)
//     // reject(false)
//     throw new Error('ERROR')
// })

// let p2 = p1.then(value => {
//     return p2
// }, err => {
//     return err
// })

// p2.then(value => {
//     console.log('s:', value)
// }, err => {
//     console.log('e:', err)
// })

// let x = {}
// Object.defineProperty(x, 'then', {
//     get() {
//         return () => {

//         }
//     }
// })

// console.log(x.then)

// const p = new Promise((resolve, reject) => {
//     resolve(false)
// })

// const p2 = p.then(value => {
//     return new Promise((resolve, reject) => {
//         reject(new Promise((resolve, reject) => {

//         }))
//         // resolve(new Promise((resolve, reject) => {
//         //     resolve('co')
//         // }))
//     })
// }, reason => {
//     return new Promise((resolve, reject) => {
//         resolve(new Promise((resolve, reject) => {
//             resolve(reason)
//         }))
//     })
// })

// p2.then(value => {
//     console.log('s: ', value)
// }, reason => {
//     console.log('e: ', reason)
// })