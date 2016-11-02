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
                rl.close
                resolve(uname.replace(/\s/g, ''))
            })
        })
    }

    function setRoom() {
        return new Promise((resolve, reject) => {
            rl.question('Enter room to join or create: ', (room) => {
                rl.close
                resolve(
                    room
                        .trim()
                        .toLowerCase()
                        .replace(/\s/g, '-')
               )
            })
        })
    }

    function setMessage() {
        return new Promise((resolve, reject) => {
            rl.question('>', (message) => {
                rl.close
                resolve(message)
            })
        })
    }

    return {
        setMessage,
        setRoom,
        setName
    }
    
})()

module.exports = Input
