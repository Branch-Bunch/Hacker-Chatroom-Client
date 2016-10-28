'use strict'

const io = require('socket.io-client')
const rooms = require('./rooms.js')
console.log('booting up HackerRoom-Client')

const socket = io.connect('http://localhost:3030/')

socket.on('connect', function(data) {
  console.log('connected')
})

socket.on('invalid', (error) => {
  console.log('error', error)
})

socket.on('test', (data) => {
  console.log(data)
})
