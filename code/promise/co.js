const fs = require('fs').promises

function* read() {
    const name = yield fs.readFile('./code/name.txt', 'utf-8')
    const age = yield fs.readFile(`./code/${name}`, 'utf-8')
    return age
}
// const it = read();
// it.next().value.then(value => {
//     it.next(value).value.then(value => {
//         console.log(value)
//     })
// })

/**
 * async + await => generator + co
 * @param {*} it 
 * @returns 
 */
function co(it) {
    return new Promise((resolve, reject) => {
        function next(data) {
            const {
                value,
                done
            } = it.next(data)
            console.log('co: ', value, done)
            if (done) {
                resolve(value)
            } else {
                Promise.resolve(value).then(data => {
                    next(data)
                }, error => {
                    reject(error)
                })
            }
        }
        next()
    })
}

co(read()).then(value => {
    console.log(value)
})