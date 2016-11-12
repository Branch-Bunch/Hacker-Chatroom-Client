'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const Colors = require('./color.js')

const socket = io.connect(Config.heroku)
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
        process.stdout.write(Colors.cyan +`${hour}:0${min} : ` + Colors.reset + Colors.yellowBgBlackLt +`${data.name}` + Colors.reset +`\n`)
    } else {
        process.stdout.write(Colors.cyan +`${hour}:${min} : ` + Colors.reset + Colors.yellowBgBlackLt +`${data.name}` + Colors.reset +`\n`)
    }
    process.stdout.write(Colors.reset + `- ${data.message}` + `\n`)
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
