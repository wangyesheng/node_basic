const EventEmitter = require('events')
const fs = require('fs')

class ReadStream extends EventEmitter {
    constructor(path, options = {}) {
        super()
        this.path = path
        this.flags = options.flags || 'r'
        this.encoding = options.encoding || null
        this.highWaterMark = options.highWaterMark || 64 * 1024
        this.mode = options.mode || 438
        this.start = options.start || 0
        this.end = options.end
        this.autoClose = true

        this.flowing = false // 默认暂停模式
        this.offest = 0
        this.hadClosed = false
        this.open()
        this.on('newListener', type => {
            if (type == 'data') {
                this.flowing = true
                this.read()
            }
        })
    }

    read(fd) {
        if (typeof fd !== 'number') {
            return this.once('open', this.read)
        }

        const howMuchToRead = this.end ? Math.min((this.end - this.start + 1 - this.offest), this.highWaterMark) : this.highWaterMark
        const buffer = Buffer.alloc(howMuchToRead)
        fs.read(fd, buffer, 0, howMuchToRead, this.offest, (err, bytesRead) => {
            if (bytesRead > 0) {
                this.offest += bytesRead
                this.emit('data', buffer)
                this.flowing && this.read(fd)
            } else {
                this.emit('end')
                this.close()
            }
        })
    }

    close() {
        if (this.autoClose) {
            fs.close(this.fd, () => {
                this.emit('close')
                this.hadClosed = true
            })
        }
    }

    open() {
        fs.open(this.path, this.flags, (err, fd) => {
            this.fd = fd
            this.emit('open', fd)
        })
    }

    pause() {
        this.flowing = false;
    }

    resume() {
        this.flowing = true;
        !this.hadClosed && this.read(this.fd)
    }
}

module.exports = ReadStream