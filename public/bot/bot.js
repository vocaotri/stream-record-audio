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
// check user disconnect
socket.on("user-reconnect", (data) => {
  if (data.is_host === true) {
    setTimeout(function () {
      init()
    }, 1500)
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
    iceServers: [
      {
        urls: "stun:stun.l.google.com",
      },
    ],
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
function handleTrackEvent(e) {
  document.getElementById("audio").srcObject = e.streams[0];
}
