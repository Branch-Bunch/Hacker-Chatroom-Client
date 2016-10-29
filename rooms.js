'use strict'
const request = require('request-promise');
const options = {
    uri: 'https://hacker-chatroom.herokuapp.com/rooms',
    method: 'GET'
}

module.exports.getRooms = new Promise((resolve, reject) => {
    request(options).then((data) => {
        resolve(JSON.parse(data))
    }).catch((err) => {
        reject(err)
    })
})
