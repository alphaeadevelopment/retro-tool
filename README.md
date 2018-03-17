# Retrospective Tool

## About
A simple web-based Team Retrospective co-ordination tool.

This app is built as a [Node](https://nodejs.org)/[Express](https://expressjs.com/) server,
with [socket.io](https://socket.io/) providing real-time communication between the server and connected clients.

## Homepage
[https://alphaeadevelopment.github.io/retro-tool/](https://alphaeadevelopment.github.io/retro-tool/)

## User Guide
[https://alphaeadevelopment.github.io/retro-tool/UserGuide.html](https://alphaeadevelopment.github.io/retro-tool/UserGuide.html)


## Hosted service

https://retro-tool.herokuapp.com

_IMPORTANT: No assurances are made in respect of either the resilience or the security of data submitted to the hosted service. Although the hosted service does persist session data in a mongo database, it will periodically sweep and purge any sessions that have no connected users. This is to ensure that the size of the datastore remains within free usage limits._

## Running locally

### Prerequisites
You will need to have [nodejs](https://nodejs.org) installed.
```
git clone https://github.com/alphaeadevelopment/retro-tool.git
cd retro-tool
npm install
npm start
```

### Note about persistence
Session data can be held in-memory or in mongodb.

To use mongo db, start the server as follows:
```
DAO=mongo MONGODB_URL=<mongodb_url> DATABASE_NAME=<database_name> npm start
```

## Contributions and feedback
Please feel free to fork this repository and submit pull requests, or send feedback/suggestions/bug reports
to me directly at [alphaeadevelopment@gmail.com](mailto:alphaeadevelopment@gmail.com?subject=retro-tool)
