module.exports.userDisconnect = function (user, peerUser) {
    var userID = user.user_id;
    if (typeof peerUser[userID] === "undefined")
        return peerUser;
    else {
        peerUser[userID].close();
        delete peerUser[userID];
        return peerUser;
    }
}