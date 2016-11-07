'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const Colors = require('./color.js')

const socket = io.connect(Config.heroku)

let username = 'anonymous'

let username = 'anonymous' 

socket.on('connect', (data) => {
    console.log('Connected to Server')

    Input.setName()
        .then((uname) => {
            username = uname
            return Rooms.getRooms()
        })
        .then((chatRooms) => {
            console.log('Available rooms:')
            if (chatRooms.length) {
                chatRooms
                    .forEach(room => console.log(`${room.name}: ${room.size} online`))
            } else {
                console.log('No current chat rooms, create your own.')
            }

            return Input.setRoom()
        })
        .then((room) => {
            socket.emit('create', room)
            console.log(`Joined room: ${room}`)
            listenForInput()
        })
        .catch((err) => {
            console.log('Error getting rooms', err)
        })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

socket.on('chat', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
<<<<<<< HEAD
=======
	console.log('\n')
    //TODO: Fix the % sign showing up
>>>>>>> fixed styling, still could improve it tho
    if (min < 10) {
        process.stdout.write(Colors.cyan +`${hour}:0${min} : ` + Colors.reset + Colors.yellowBgBlackLt +`${data.name}` + Colors.reset +`\n`)
    } else {
        process.stdout.write(Colors.cyan +`${hour}:${min} : ` + Colors.reset + Colors.yellowBgBlackLt +`${data.name}` + Colors.reset +`\n`)
    }
    console.log(Colors.reset,`- ${data.message}`)
	Input.resetCursor()
})

function listenForInput() {
    Input.setMessage()
        .then((message) => {
            if (message === ':q') {
                process.exit()
            }
            socket.emit('chat', {
                name: username,
                date: new Date(),
                message: message
            })
			listenForInput() 
        })
        .catch((err) => {
            console.log('Error sending message', err)
        })
}
