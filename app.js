#! /usr/bin/env node
'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const color = require('ansi-color').set

const socket = io.connect(Config.serverURL)

// User config on startup
let username = 'anonymous'
const userConfig = Input.setName()
    .then((uname) => {
        username = uname
        return getAndPrintRooms()
    })
    .then(() => {
        return Input.setRoom()
    })
    .catch((err) => console.log('Error getting rooms: ', err))

// Socket events
socket.on('connect', (data) => {
    userConfig
        .then((room) => {
            joinHandler(room)
            Input.setMessage(messageHandler)
            Input.setLeave(leaveHandler)
            Input.setPrompt()
        })
        .catch((err) => console.log('Error connecting to room: ', err))
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

// Event handlers
function messageHandler(message) {
    switch (message) {
        case ':q':
            leaveHandler()
            break

        case ':cr': 
            socket.emit('leave-room', username)
            console.log('Left room')
            getAndPrintRooms()
                .then(() => {
                    return Input.setRoom()
                })
                .then((room) => {
                    joinHandler(room)
                    Input.setPrompt()
                })
                .catch((err) => console.log('Error getting rooms: ', err))
            break

        case ':gr':
            getAndPrintRooms()
                .then(() => {
                    Input.setPrompt()
                })
            break

        case ':help':
            console.log(':q  - Quit')
            console.log(':cr - Change room')
            console.log(':gr - Get rooms')
            Input.setPrompt()
            break

        default:
             socket.emit('chat', {
                name: username,
                date: new Date(),
                message: message
            })
    }
}

function leaveHandler() {
    socket.emit('leave-room', username)
    process.exit()
}

function joinHandler(room) {
    socket.emit('join-room', room, username)
    console.log(`Joined room: ${room}`)
    console.log('Type ":" and tab for help and options')
}

// Helper functions
function getAndPrintRooms() {
    return Rooms.getRooms()
        .then((rooms) => {
            printAvailableRooms(rooms)
        })
        .catch((err) => console.log('Error getting rooms: ', err))
}

function printAvailableRooms(rooms) {
    console.log('\nAvailable rooms:')
    if (rooms.length) {
        rooms
            .forEach(room => console.log(`${room.name}: ${room.size} online`))
    } else {
        console.log('No current chat rooms, create your own.')
    }
    console.log()
}

function print(...data) {
    Input.clearLine()
    data.forEach(line => { process.stdout.write(line) }) 
    Input.setPrompt()
}
