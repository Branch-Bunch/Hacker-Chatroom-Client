'use strict'

const io = require('socket.io-client')
const readline = require('readline')
const rooms = require('./rooms.js')
const local = 'http://localhost:3030'
const heroku = 'https://hacker-chatroom.herokuapp.com'

let username = 'anonymous'
// For local testing: http:localhost:3030
const socket = io.connect(heroku)
// const socket = io.connect('http://localhost:3030')

let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

socket.on('connect', (data) => {
    socket.emit('create', 'room1')
    console.log('Connected to Server')
    rooms.getRooms.then((data) => {
        console.log(Object.keys(data));
    }).catch((err) => {
        console.log(err);
    })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

//socket.on('test', (data) => {
//    console.log('Recieved in test: ', data)
//})

socket.on('general', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
      if (min < 10) {
        console.log(Cyan,`${hour}:0${min} -`, BgYellow,` ${data.name}`)
        console.log(`- ${data.message}`)
      } else {
    console.log(Cyan,`${hour}:${min} -`, BgYellow, ` ${data.name}`)
    console.log(`- ${data.message}`)
    }
})

socket.on('setname', (data) => {
    setName()
})

socket.on('sendmessage', (date) => {
    sendMessage()
})

function setName() {
    rl.question('Enter username: ', (uname) => {
        username = uname
        rl.close
        sendMessage()
    })
}

function sendMessage() {
    //console.log('>')
    rl.question('>', (answer) => {
		if(answer === 'quit'){
			rl.close
            process.exit()
		}
		socket.emit('general', {
			name: username,
			date: new Date(),
			message: answer
   		})
        rl.close
		sendMessage()
	})
}


var Cyan = "\x1b[36m%s\x1b[0m"
var BgYellow = "\x1b[43m%s\x1b[0m "
