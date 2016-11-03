'use strict'

const Config = require('./config.js')
const request = require('request-promise')

const Rooms = (() => {
	const local = `${Config.local}/rooms`
	const heroku = `${Config.heroku}/rooms` 
    const options = {
        uri: heroku,
        method: 'GET'
    }

    function getRooms() {
        return new Promise((resolve, reject) => {
            request(options)
                .then((data) => {
                    const rooms = JSON.parse(data)
                    let chatRooms = Object.keys(rooms)
                        .filter(room => Object.keys(rooms[room].sockets)[0] !== room)

                    if (chatRooms.length === 0) {
                        chatRooms.push('default-room') 
                    }

                    resolve(chatRooms)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    }

    return {
        getRooms
    }

})()

module.exports = Rooms
