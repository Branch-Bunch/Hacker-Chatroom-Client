'use strict'

const io = require('socket.io-client')
const Config = require('./config.js')
const Rooms  = require('./rooms.js')
const Input = require('./input.js')
const Colors = require('./color.js')

const socket = io.connect(Config.local)

socket.on('connect', (data) => {
    console.log('Connected to Server')
    Rooms.getRooms(socket).then((chatRooms) => {
        console.log('Available rooms:')
        console.log(chatRooms)
        if (chatRooms.length === 1) {
            console.log(`Joined ${chatRooms[0]}`)
            socket.emit('create', chatRooms[0])
        }
    // TODO: Select room or create room
	Input.setName(socket)
    Input.sendMessage(socket)
    }).catch((err) => {
        console.log('Error getting rooms', err)
    })
})

socket.on('invalid', (error) => {
    console.log('error', error)
})

socket.on('general', (data) => {
    const date = new Date(data.date)
    const hour = date.getHours()
    const min = date.getMinutes()
    //TODO: Fix the % sign showing up
    if (min < 10) {
        console.log(Colors.cyan,`${hour}:0${min} :`, Colors.yellowBgBlackLt,` ${data.name}`)
    } else {
        console.log(Colors.cyan,`${hour}:${min} :`, Colors.yellowBgBlackLt, ` ${data.name}`)
    }
    console.log(Colors.reset,`- ${data.message}`)
})
