const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var socket = io();

// join room 
socket.emit("join-room", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id") });
// check user disconnect
socket.on("user-disconnect", (data) => {
    if (data.is_host === true) {
        // alert('host has left room')
    }
})
// check user reconnect
socket.on("user-reconnect", (data) => {
    // do some thing
    // if (data.is_host === true) {
    //     setTimeout(function() {
    //         init()
    //     }, 2000)
    // }
})
// check host start stream
socket.on("listen-stream", (data) => {
    if (data.is_host === true) {
        setTimeout(function () {
            init()
            document.getElementById('chat').removeAttribute('disabled');
            socket.emit("start-stream", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id") })
        }, 800)
    }
})
// listen chat
socket.on("listen-chat", (data) => {
    chatMain = document.getElementsByClassName('chat-main');
    chatMain[0].insertAdjacentHTML('beforeend', `<p><span class="time-record">${data.record_time}</span> <span class="user_name">User: ${data.user_id}</span> <span class="chat-message">${data.message}</span></p>`)
    document.getElementById('chat-input').value = ""
})
// init();
window.onload = () => {
    document.getElementById("my-button").onclick = () => {
        init();
    };
};
async function init() {
    const peer = createPeer();
    peer.addTransceiver("audio", { direction: "recvonly" });
    var btnChat = document.getElementById('chat');
    btnChat.onclick = () => {
        var content = document.getElementById('chat-input').value;
        socket.emit("chat-room", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id"), is_host: true, message: content })
    }
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [{
            urls: "stun:stun.l.google.com",
        },],
    });
    peer.ontrack = handleTrackEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(peer);

    return peer;
}

async function handleNegotiationNeededEvent(peer) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const payload = {
        sdp: peer.localDescription,
    };

    const { data } = await axios.post(
        "/consumer/" + urlParams.get("room_id") + "/" + urlParams.get("user_id"),
        payload
    );
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
}

function handleTrackEvent(e) {
    document.getElementById("audio").srcObject = e.streams[0];
}