/**
 * 核心：读取一点写一点，不会导致内存被湮没，出现进程卡死的状况
 * fs.open fs.read fs.write fs.close
 * r 读取
 * w 写入
 * r+ 在读的基础上可以写，但是文件不存在会报错
 * w+ 在写的基础上可以读，如果文件不存在会创建
 */
const fs = require('fs')
const buffer = Buffer.alloc(5)
fs.open('./README.md', 'r', (err, rfd) => {
    fs.open('./name.copy.txt', 'w', (err, wfd) => {
        // 读取文件，rfd 代表文件本身，buffer 表示我要把读取的文件暂存于哪个缓存区 buffer 中，
        // 0,3 表示从 buffer 的第 0 个位置开始写入 写入 3 个
        // 0 表示从文件的那个位置开始读取
        fs.read(rfd, buffer, 0, 3, 0, (err, bytesRead) => {
            // 写入文件，wfd 代表文件本身，buffer 表示我要从哪个缓存区 buffer 中读取数据，
            // 0,3 表示从 buffer 的第 0 个位置开始读取 读取 3 个
            // 0 表示从文件的那个位置开始写入
            fs.write(wfd, buffer, 0, bytesRead, 0, (err, bytesWrite) => {
                if (err) {
                    console.log(err)
                }
                fs.close(rfd)
                fs.close(wfd)
                return
            })
        })
    })
})

const fs = require('fs')
const SIZE = 5; // 每次读取多少个
const buffer = Buffer.alloc(SIZE)
let offest = 0

fs.open('./README.md', 'r', (err, rfd) => {
    fs.open('./README.copy.md', 'w', (err, wfd) => {
        function next() {
            // 每次都是从 buffer 的第 0 个位置开始写，所以第二次 buffer 中的值覆盖了第一次的值
            fs.read(rfd, buffer, 0, SIZE, offest, (err, bytesRead) => {
                if (bytesRead == 0) {
                    fs.close(rfd)
                    fs.close(wfd)
                    return
                }
                fs.write(wfd, buffer, 0, bytesRead, offest, (err, bytesWrite) => {
                    offest += bytesRead
                    next()
                })
            })
        }
        next()
    })
})


const fs = require('fs')

function mkdir(paths, cb) {
    paths = paths.split('/')
    let index = 1
    // 异步迭代 next
    function next() {
        if (index == paths.length + 1) {
            return cb()
        }
        let dirPath = paths.slice(0, index++).join('/')
        fs.access(dirPath, function (err) {
            if (err) {
                // 不存在
                fs.mkdir(dirPath, next)
            } else {
                next()
            }
        })
    }
    next()
}

mkdir('a/b/c/d/e/f/g/h', () => {
    console.log('创建成功')
})


const fs = require('fs')
const path = require('path')
// a => b & a.js
fs.readdir('a', (err, files) => {
    files = files.map(x => path.join('a', x))
    let index = 0
    const done = () => {
        if (index == files.length) {
            fs.rmdir('a', () => {
                console.log('删除成功')
            })
        }
    }
    files.forEach(file => {
        fs.stat(file, (err, statObj) => {
            if (statObj.isFile()) {
                fs.unlink(file, () => {
                    index++
                    done()
                })
            } else {
                fs.rmdir(file, () => {
                    index++
                    done()
                })
            }
        })
    })
})



/**
 * 先序深度删除文件夹及文件 - 串行
 * @param {*} dir 
 * @param {*} cb 
 */
const fs = require('fs')
const path = require('path')

function preDeep(dir, cb) {
    fs.stat(dir, (err, statObj) => {
        if (statObj.isFile()) {
            fs.unlink(dir, cb)
        } else {
            fs.readdir(dir, (err, files) => {
                /**
                 *       a
                 * a.js       b
                 *       b.js    c 
                 */
                files = files.map(file => path.join(dir, file))
                let index = 0

                function next() {
                    if (index == files.length) {
                        return fs.rmdir(dir, cb)
                    }
                    const currentPath = files[index++]
                    preDepp(currentPath, next)
                }
                next()
            })
        }
    })
}

preDeep('a', () => {
    console.log('删除成功')
})

/**
 * 先序并行删除文件夹及文件 - 并行
 * @param {*} dir 
 * @param {*} cb
 */
const fs = require('fs')
const path = require('path')

function preParallDeep(dir, cb) {
    fs.stat(dir, (err, statObj) => {
        if (statObj.isFile()) {
            fs.unlink(dir, cb)
        } else {
            fs.readdir(dir, (err, files) => {
                /**
                 *       a
                 * a.js       b
                 *        c      b.js 
                 */
                files = files.map(file => path.join(dir, file))
                if (files.length == 0) {
                    return fs.rmdir(dir, cb)
                }
                let index = 0
                const done = () => {
                    if (++index == files.length) {
                        return fs.rmdir(dir, cb)
                    }
                }
                files.forEach(file => {
                    preParallDeep(file, done)
                })
            })
        }
    })
}
preParallDeep('a', () => {
    console.log('删除成功')
})


const fs = require('fs')
const path = require('path')

function deepPromisify(dir) {
    return new Promise((resolve, reject) => {
        fs.stat(dir, (err, statObj) => {
            if (statObj.isFile()) {
                fs.unlink(dir, () => {
                    resolve(true)
                })
            } else {
                fs.readdir(dir, (err, files) => {
                    files = files.map(file => deepPromisify(path.join(dir, file)))
                    Promise.all(files).then((values) => {
                        console.log(values)
                        if (values.every(val => val))
                            fs.rmdir(dir, () => {
                                resolve(true)
                            })
                    })
                })
            }
        })
    })
}

deepPromisify('a').then((value) => {
    console.log('删除成功', value)
})

const {
    readdir,
    unlink,
    rmdir,
    stat
} = require('fs').promises
const path = require('path')

async function finallyDeep(dir) {
    const statObj = await stat(dir)
    if (statObj.isFile()) {
        await unlink(dir)
    } else {
        let files = await readdir(dir)
        files = files.map(file => finallyDeep(path.join(dir, file)))
        await Promise.all(files)
        await rmdir(dir)
    }
}

finallyDeep('a').then(() => {
    console.log('删除成功')
})