'use strict'

const io = require('socket.io-client')
const rooms = require('./rooms.js')
console.log('booting up HackerRoom-Client')

// For local testing: http:localhost:3030
const socket = io.connect('https://hacker-chatroom.herokuapp.com')
// const socket = io.connect('http://localhost:3030')


socket.on('connect', (data) => {
    socket.emit('create', 'room1')
    console.log('Connected to Server')
    socket.emit('general', {
        name: 'Admin',
        date: new Date(),
        message: 'TEST TEST TEST'
    })
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
    console.log(`${hour}:${min} - ${data.name}`)
    console.log(`- ${data.message}`)
})
