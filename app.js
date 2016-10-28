'use strict'

const io = require("socket.io-client")
// For local testing: http:localhost:3030
// const socket = io.connect('https://hacker-chatroom.herokuapp.com')
const socket = io.connect('http://localhost:3030')

socket.on('connect', (data) => {
    console.log('Connected to Server')
    socket.emit('general', {
        name: 'Admin',
        date: new Date(),
        message: 'TEST TEST TEST'
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
