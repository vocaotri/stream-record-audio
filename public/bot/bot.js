const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var socket = io();

// join room 
socket.emit("join-room", { user_id: 0, room_id: urlParams.get("room_id") });
// check user reconnect
socket.on("user-reconnect", (data) => {
        // do some thing
        // if (data.is_host === true) {
        //     setTimeout(function() {
        //         init()
        //     }, 1500)
        // }
    })
    // check host start stream
socket.on("listen-stream", (data) => {
        if (data.is_host === true) {
            setTimeout(function() {
                init()
            }, 500)
        }
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
}

function createPeer() {
    const peer = new RTCPeerConnection({
        iceServers: [{
            urls: "stun:stun.l.google.com",
        }, ],
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
        "/bot-record/" + urlParams.get("room_id"),
        payload
    );
    const desc = new RTCSessionDescription(data.sdp);
    peer.setRemoteDescription(desc).catch((e) => console.log(e));
}
recordedChunks = [];

function handleTrackEvent(e) {
    document.getElementById("audio").srcObject = e.streams[0];
    try {
        window.recording = new MediaRecorder(e.streams[0]);
    } catch (err) {
        socket.emit("fail-record", { user_id: 0, room_id: urlParams.get("room_id") });
    }
    recording.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
            download();
        } else {
            //....
        }
    };
    recording.start();
}

function download() {
    var blob = new Blob(recordedChunks, {
        type: "audio/mp3",
    });

    var reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function() {
        var base64data = reader.result;
        axios.post(
            "/upload", { blob: base64data }
        ).then(res => {
            if (res.status === 201)
                alert('send data success');
        });
    }
}
// check user disconnect
socket.on("user-disconnect", (data) => {
    if (data.is_host === true) {
        // alert('host has left room')
        if (recording)
            recording.stop()
    }
})