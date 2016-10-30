'use strict'

const io = require('socket.io-client')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')

const local = 'http://localhost:3030'
const heroku = 'https://hacker-chatroom.herokuapp.com'

// For local testing: http:localhost:3030
const socket = io.connect(local)
// const socket = io.connect('http://localhost:3030')

socket.on('connect', (data) => {
    console.log('Connected to Server')
    Rooms.getRooms(socket).then((chatRooms) => {
        console.log('Available rooms:')
        console.log(chatRooms)
        if (chatRooms.length === 1) {
            console.log(`Joined ${chatRooms[0]}`)
            socket.emit('create', chatRooms[0])
        }
    Input.sendMessage(socket)
    }).catch((err) => {
        console.error('Error getting rooms', err)
    })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

socket.on('general', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
    if (min < 10) {
        console.log(Cyan,`${hour}:0${min} -`, BgYellow,` ${data.name}`)
    } else {
        console.log(Cyan,`${hour}:${min} -`, BgYellow, ` ${data.name}`)
    }
    console.log(`- ${data.message}`)
})

