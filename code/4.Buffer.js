const buffer = Buffer.from(
    `珠峰珠峰珠峰珠峰珠峰
    珠峰珠峰珠峰珠峰珠峰珠峰珠峰珠峰
    珠峰珠峰珠峰珠峰珠峰珠峰珠峰珠峰
    珠峰珠峰珠峰珠峰珠峰珠峰珠峰珠峰`
)

console.log(buffer)

Buffer.prototype.split = function (sep) {
    const len = Buffer.from(sep).length
    let offest = 0,
        result = [],
        current
    while ((current = this.indexOf(sep, offest)) !== -1) {
        console.log(current)
        result.push(this.slice(offest, current))
        console.log(result)
        offest = current + len
        console.log(offest)
    }
    result.push(this.slice(offest))
    return result
}

console.log(buffer.split('\n').map(x => x.toString()))

console.log(Buffer.from('jack is a boy and lily').indexOf('i', 1))

console.log(Buffer.from('\n'))


