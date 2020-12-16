const users = []

// join user
function userJoin(id, username, room) {
  const user = { id, username, room }

  users.push(user)

  return user
}

// get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id)
}

// user leaves
function userLeave(id) {
  const index = users.findIndex(user => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

// get room
function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers }