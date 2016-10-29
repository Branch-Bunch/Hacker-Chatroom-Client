'use strict'

const io = require("socket.io-client")
const readline = require("readline")
const rooms = require('./rooms.js')

// For local testing: http:localhost:3030
const socket = io.connect('https://hacker-chatroom.herokuapp.com')
// const socket = io.connect('http://localhost:3030')


let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', (data) => {
    socket.emit('create', 'room1')
    console.log('Connected to Server')
    sendMessage()
    rooms.getRooms.then((data) => {
        console.log(Object.keys(data));
    }).catch((err) => {
        console.log(err);
    })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

socket.on('test', (data) => {
    console.log('Recieved in test: ', data)
})

socket.on('general', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
      if (min < 10) {
        console.log(`${hour}:0${min} - ${data.name}`)
        console.log(`- ${data.message}`)
      } else {
    console.log(`${hour}:${min} - ${data.name}`)
    console.log(`- ${data.message}`)
    }
})

function sendMessage(){
	rl.question("What do u wana send ", (answer) => {
		socket.emit('general', {
			name: 'Admin',
			date: new Date(),
			message: answer
   		})
	})
 	rl.close
}
