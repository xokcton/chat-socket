const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const adminName = 'Chat Admin'

// Static folder
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)

    // welcome
    socket.emit('message', formatMessage(adminName, 'Welcome to chat!'))

    // connect
    socket.broadcast.to(user.room).emit('message', formatMessage(adminName, `${user.username} has joined the chat!`))

    sendUsers(user.room)
  })

  // chatMessages
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id)

    io.to(user.room).emit('message', formatMessage(user.username, msg))
  })

  // disconnect
  socket.on('disconnect', () => {
    const user = userLeave(socket.id)

    if (user) {
      io.to(user.room).emit('message', formatMessage(adminName, `${user.username} has left the chat!`))

      sendUsers(user.room)
    }
  })
})

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

function sendUsers(room) {
  // send users and room info
  io.to(room).emit('roomUsers', {
    room: room,
    users: getRoomUsers(room)
  })
}