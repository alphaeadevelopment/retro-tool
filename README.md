# Retrospective Tool

## About
A simple web-based Team Retrospective co-ordination tool.

This app is built as a [Node](https://nodejs.org)/[Express](https://expressjs.com/) server,
with [socket.io](https://socket.io/) providing real-time communication between the server and connected clients.

## Demo

https://retro-tool.herokuapp.com

## Running the application locally

### Prerequisites
```
git clone https://github.com/alphaeadevelopment/retro-tool.git
cd retro-tool
npm install
npm start
```

## Note about persistence
Session data is currently only held in-memory, so any restart/crash of the server will result in lost data.

## Contributions and feedback
Please feel free to fork this repository and submit pull requests, or send feedback/suggestions
to me directly at alphaeadevelopment@gmail.com
