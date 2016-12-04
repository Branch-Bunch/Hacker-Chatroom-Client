'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const color = require('ansi-color').set

const socket = io.connect(Config.serverURL)
let username = 'anonymous'

// User config on startup
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

// Socket events
socket.on('connect', (data) => {
    userConfig
        .then((room) => {
            socket.emit('join-room', room, username)
            console.log(`Joined room: ${room}`)

            Input.setMessage(messageHandler)
            Input.setLeave(leaveHandler)
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
    const pad = min < 10 ? `0` : ``

	//TODO: recive color from server based on who sent the message
    print(
        color(`${hour}:${pad}${min}:`, 'cyan+underline'),
        ' ',
        color(`${data.name}\n`, 'yellow+underline'),
        color(`- ${data.message}\n`, 'blue+bold' )
    )
})

socket.on('invalid', (err) => {
    console.log('Error invalid: ', err)
})

// TODO: Put the join and leave messages on client to use colour
socket.on('leave-room', (data) => {
    print(`${data}\n`)
})

socket.on('join-room', (data) => {
    print(`${data}\n`)
})

// Helper functions
function messageHandler(message) {
    if (message === ':q') {
        leaveHandler()
    }
    socket.emit('chat', {
        name: username,
        date: new Date(),
        message: message
    })
}

function leaveHandler() {
    socket.emit('leave-room', username)
    process.exit()
}

function print(...data) {
    Input.clearLine()
    data.forEach(line => { process.stdout.write(line) }) 
    Input.setPrompt()
}
