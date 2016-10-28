'use strict'

const io = require("socket.io-client")
const readline = require("readline")

console.log('booting up HackerRoom-Client')

const socket = io.connect('http://localhost:3030/')

var rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

socket.on('connect', function(data) {
    console.log('connected')
	sendMessage()
})

socket.on('invalid', (error) => {
  console.log('error', error)
})

socket.on('test', (data) => {
  console.log(data)
})

function sendMessage(){
	rl.question("What do u wana send ", (answer) => {
		socket.emit('general', {
			name: 'Admin',
			date: new Date(),
			message: ${answer} 
   		})
	}
 	rl.close;
}
