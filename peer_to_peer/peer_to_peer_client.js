
//Caller
// Servers is an optional configuration file. (See TURN and STUN discussion later.)
pc1 = new RTCPeerConnection(servers);
// ...
localStream.getTracks().forEach((track) => {
  pc1.addTrack(track, localStream);
});


//offer

pc1.setLocalDescription(desc).then(() => {
    onSetLocalSuccess(pc1);
  },
  onSetSessionDescriptionError
);
trace('pc2 setRemoteDescription start');
pc2.setRemoteDescription(desc).then(() => {
    onSetRemoteSuccess(pc2);
  },
  onSetSessionDescriptionError
);


//callee

pc2 = new RTCPeerConnection(servers);
pc2.ontrack = gotRemoteStream;
//...
function gotRemoteStream(e){
  vid2.srcObject = e.stream;
}