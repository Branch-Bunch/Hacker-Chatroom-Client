'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const color = require('ansi-color').set

const socket = io.connect(Config.serverURL)
let username = 'anonymous'

const userConfig = Input.setName()
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
    .catch((err) => {
        console.log('Error getting rooms: ', err)
    })

socket.on('connect', (data) => {
    userConfig
        .then((room) => {
            socket.emit('create', room)
            console.log(`Joined room: ${room}`)

            Input.setMessage(messageHandler)
            Input.setPrompt()
        })
        .catch((err) => {
            console.log('Error connecting to room: ', err)
        })
})

socket.on('chat', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()

    Input.clearLine()
    if (min < 10) {
        process.stdout.write(color(`${hour}:0${min} : `, 'cyan'))
		process.stdout.write(color(`${data.name}` + `\n`, 'yellow'))
    } else {
        process.stdout.write(color(`${hour}:${min} : `, 'green'))
		process.stdout.write(color(`${data.name}` + `\n`, 'yellow'))
    }
	//TODO: recive color from server based on who sent the message
    process.stdout.write(color(`- ${data.message}` + `\n`, 'blue+bold' ))
    Input.setPrompt()
})

socket.on('invalid', (err) => {
    console.log('Error invalid: ', err)
})

function messageHandler(message) {
    if (message === ':q') {
        process.exit()
    }
    socket.emit('chat', {
        name: username,
        date: new Date(),
        message: message
    })
}
