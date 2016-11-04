# Hacker-Chatroom-Client

## What is this?
Hacker Chatroom is a messaging service we created to be able to chat in a terminal based client.

## Why?
Everyone likes to feel `Hack3r Statu$` sometimes 😎.

## Clone and Run

    git clone https://github.com/Hacker-Chatroom/Hacker-Chatroom-Client.git 
    cd Hacker-Chatroom-Client
    npm install
    
    # Make sure you're connecting to our server by changing the following variables

    # In app.js socket to:
    const socket = io.connect(Config.heroku)

    # In room.js options to:
    const options = {
        uri: heroku,
        method: 'GET'
    }
    
    # Then run
    node app.js

## Running Locally 

    # Head over to our server repo and clone and run it
    # Make sure in app.js and rooms.js, you're connecting to the local server
    # Then run
    node app.js 
