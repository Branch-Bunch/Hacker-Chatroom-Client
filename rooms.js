'use strict'

const Config = require('./config.js')
const request = require('request-promise')

const Rooms = (() => {
    
    const options = {
        uri: `${Config.serverURL}/rooms`,
        method: 'GET'
    }

    function getRooms() {
        return new Promise((resolve, reject) => {
            request(options)
                .then((data) => {
                    resolve(JSON.parse(data))
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
