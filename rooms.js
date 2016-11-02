'use strict'

const request = require('request-promise')

const Rooms = (() => {
	let local = 'http://localhost:3030/rooms'
	let heroku = 'https://hacker-chatroom.herokuapp.com/rooms' 
    const options = {
        uri: local,
        method: 'GET'
    }

    return {
        getRooms: (socket) => {
            return new Promise((resolve, reject) => {
                request(options).then((data) => {
                    const rooms = JSON.parse(data)
                    let chatRooms = Object.keys(rooms)
                        .filter(room => Object.keys(rooms[room].sockets)[0] !== room)

                    if (chatRooms.length === 0) {
                        socket.emit('create', 'Default Room')
                        chatRooms.push('Default Room') 
                    }

                    resolve(chatRooms)
                }).catch((err) => {
                    reject(err);
                })
            })
        }
    }
})()

module.exports = Rooms
