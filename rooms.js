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
