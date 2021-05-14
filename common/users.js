let users = [];
function joinUser(socketId, userID, roomID, isHost = false) {
    const user = {
        socketID: socketId,
        user_id: userID,
        room_id: roomID,
        is_host: isHost
    }
    users.push(user)
    return user;
}
function findUser(id) {
    return users.find((user) => {
        user.id === id;
    })
}
function removeUser(id) {
    const getID = users => users.socketID === id;
    const index = users.findIndex(getID);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}
module.exports = { joinUser, removeUser, findUser }