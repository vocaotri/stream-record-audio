const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var socket = io();
// check user disconnect
socket.on("user-disconnect", (data) => {
    // console.log(data);
})
// join room 
socket.emit("join-room", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id"), is_host: true });
// check user disconnect
socket.on("user-reconnect", (data) => {
    if (data.user_id === 0) {
        document.getElementById('my-button').removeAttribute('disabled');
    }
})
// check start stream
socket.on("listen-stream", (data) => {
    document.getElementById('chat').removeAttribute('disabled');
    document.getElementById('my-button').setAttribute('disabled', true);
})
// check record fail
socket.on("listen-fail-stream", (data) => {
    if (data.user_id === 0) {
        alert('record audio has error try again, check connection your internet')
        window.location.reload()
    }
})
window.onload = () => {
    document.getElementById("my-button").onclick = () => {
        init();
    };
    var btnChat = document.getElementById('chat');
    btnChat.onclick = () => {
        socket.emit("chat-room", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id"), is_host: true })
    }
};
var cameraDeviceId = [];
getCamera();
async function init() {
    await getDeviceIdCamera();
    const stream = await getCamera({
        deviceId: {
            exact: cameraDeviceId[0].diviceId,
        },
    });
    document.getElementById("audio").srcObject = stream;
    const peer = createPeer();
    stream.getTracks().forEach((track) => peer.addTrack(track, stream));
}
async function getCamera(device = true) {
    return navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
    });
}
async function getConnectedDevices(kind = "videoinput") {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === kind);
}

async function getDeviceIdCamera(key = 0) {
    let listCamera = await getConnectedDevices();
    listCamera.forEach((item) => {
        cameraDeviceId.push({ diviceId: item.deviceId, label: item.label });
    });
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com" }],
    });
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
        "/broadcast/" + urlParams.get("room_id") + "/" + urlParams.get("user_id"),
        payload
    );
    socket.emit("start-stream", { user_id: urlParams.get("user_id"), room_id: urlParams.get("room_id"), is_host: true })
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
}
function handleCloseChannel() {
    console.log('ok');
}