const ReadStream = require('./Stream/ReadStream')
const fs = require('fs')
// const iconv = require('iconv-lite')

// const rs = fs.createReadStream('./README.md', {
//     highWaterMark: 2,
//     end: 4 // 包前又包后,从 0 的位置后开始读,读到第 11 个位置
// })

// const rs = new ReadStream('./README.md', {
//     highWaterMark: 2,
//     end: 4 // 包前又包后,从 0 的位置后开始读,读到第 11 个位置
// })

// rs.on('open', function (...args) {
//     console.log(`file is opening`, args)
// })

// rs.on('data', function (data) {
//     console.log(data)
//     rs.pause()
// })

// setInterval(() => {
//     rs.resume()
// }, 1000);

// rs.on('close', function () {
//     console.log('close')
// })

// console.log(iconv.decode(fs.readFileSync('./README.copy.md'), 'gbk'))

const rs = fs.createReadStream('./README.copy.md', {
    encoding: 'utf-8',
    highWaterMark: 2
})

rs.on('data', chunk => {
    console.log(chunk)
})