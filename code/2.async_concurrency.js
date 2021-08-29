/**
 * 异步并发问题的解决方案
 * 1. 计数器
 * 2. 发布订阅
 */

const fs = require('fs');

const school = {}

let index = 0;

function done() {
    if (index == 2) {
        console.log(school)
    }
}


fs.readFile('./code/name.txt', 'utf-8', (err, data) => {
    school['name'] = data
    index++;
    done();
})

fs.readFile('./code/age.txt', 'utf-8', (err, data) => {
    school['age'] = data
    index++;
    done();
})


const fs = require('fs');

const school = {}

const after = (times, fn) => (value) => {
    console.log(value, times)
    if (--times == 0) {
        fn()
    }
}

const newFn = after(2, () => {
    console.log(school)
})

fs.readFile('./code/name.txt', 'utf-8', (err, data) => {
    school['name'] = data
    newFn('name')
})

fs.readFile('./code/age.txt', 'utf-8', (err, data) => {
    school['age'] = data
    newFn('age')
})


const fs = require('fs');

const school = {}

const e = {
    fns: [],
    on(fn) {
        this.fns.push(fn)
    },
    emit() {
        this.fns.forEach(fn => fn())
    }
}

e.on(() => {
    if (Object.keys(school).length == 2) {
        console.log(school)
    }
})


fs.readFile('./code/name.txt', 'utf-8', (err, data) => {
    school['name'] = data
    e.emit()
})

fs.readFile('./code/age.txt', 'utf-8', (err, data) => {
    school['age'] = data
    e.emit()
})



