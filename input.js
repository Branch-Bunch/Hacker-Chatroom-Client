'use strict'

const readline = require('readline')

const Input = (() => {

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    function setName() {
        return new Promise((resolve, reject) => {
            rl.question('Enter username: ', (uname) => {
                resolve(uname.replace(/\s/g, ''))
            })
        })
    }

    function setRoom() {
        return new Promise((resolve, reject) => {
            rl.question('Enter room to join or create: ', (room) => {
                resolve(
                    room
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, '-')
                )
            })
        })
    }

    function setPrompt() {
        rl.prompt(true)
    }

    function setMessage(messageHandler) {
        rl.on('line', (message) => {
            messageHandler(message)
        })
    }

    function setLeave(leaveHandler) {
        rl.on('SIGINT', () => {
            leaveHandler() 
        })
    }

    function clearLine() {
        readline.clearLine(process.stdout, 0)
        readline.cursorTo(process.stdout, 0)
    }

    return {
        setName,
        setRoom,
        setPrompt,
        setMessage,
        setLeave,
        clearLine,
    }

})()

module.exports = Input
