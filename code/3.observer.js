/**
 * 观察者模式
 */

class Subject {
    // 被观察者
    constructor(name) {
        this.name = name
        this.os = [];
        this.state = 'happy'
    }

    attach(o) {
        this.os.push(o)
    }

    setState(newState) {
        this.state = newState
        this.os.forEach(o => o.update(this.name, newState))
    }
}

class Observer {
    constructor(type){
        this.type = type
    }
    // 观察者
    update(name, state) {
        console.log(`
           ${this.type}: baby's name is ${name} and his state is ${state}
        `)
    }
}

let s = new Subject('jack')
let s1 = new Subject('bob')
let o1 = new Observer('father')
let o2 = new Observer('mother')
s.attach(o1)
s.attach(o2)
s1.attach(o1)
s1.attach(o2)
s.setState('unhappy')
s1.setState('sad')