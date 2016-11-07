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

	function resetCursor(){
		readline.cursorTo(process.stdout, 0)
		rl.prompt(true)
	}

    function setMessage() {
        // TODO: Find a method to keep > at bottom
        return new Promise((resolve, reject) => {
            rl.question('>', (message) => {
                rl.close
                resolve(message)
            })
        })
    }

    return {
		resetCursor,
        setMessage,
        setRoom,
        setName
    }
    
})()

module.exports = Input
