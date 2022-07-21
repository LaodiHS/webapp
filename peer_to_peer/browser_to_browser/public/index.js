// Creating the peer
const peer = new RTCPeerConnection({
  iceServers: [
    {
      urls: "stun:stun.stunprotocol.org"
    }
  ]
});


let [message_history, message_box] = [[], document.getElementById("message_history")]
let chat_input = document.getElementById("chat_input")

function update_message_box(message){
  message_history.unshift(message)
  message_box.innerHTML = message_history.map(val => `<li>${val}</li>`).join(" ")
  message_box.scrollIntoView();
}

const channel = peer.createDataChannel("chat")

channel.onopen = function (event) {
  chat_input.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
    channel.send(event.target.value)
      update_message_box(event.target.value)
      event.target.value=""
    }
  })
  channel.send('Hi you!');
}

channel.onmessage = function (event) {
  
  update_message_box(event.data)

  console.log(event.data);
}

peer.ondatachannel = function(event) {
  var channel = event.channel;
    channel.onopen = function(event) {
      
      chat_input.addEventListener('keydown', (event) => {
        if (event.key === "13") { 
          update_message_box(event.target.value)
          channel.send(event.target.value)
  
     event.target.value=""
        
     
        }
      })


    channel.send('Hi back!');
  }
  channel.onmessage = function(event) {
  update_message_box(event.data)
   
  }
}






// Connecting to socket

const socket = io(window.location.host, {
  withCredentials: false,
  extraHeaders: {

    "Access-Control-Allow-Origin": "*"
  }
});

const onSocketConnected = async () => {
  const constraints = {
    audio: true,
    video: true
  };
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  document.querySelector('#localVideo').srcObject = stream;
  stream.getTracks().forEach(track => peer.addTrack(track, stream));
}

let callButton = document.querySelector('#call');

// Handle call button
callButton.addEventListener('click', async () => {
  const localPeerOffer = await peer.createOffer();
  await peer.setLocalDescription(new RTCSessionDescription(localPeerOffer));

  sendMediaOffer(localPeerOffer);
});

// Create media offer
socket.on('mediaOffer', async (data) => {
  await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
  const peerAnswer = await peer.createAnswer();
  await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));

  sendMediaAnswer(peerAnswer, data);
});

// Create media answer
socket.on('mediaAnswer', async (data) => {
  await peer.setRemoteDescription(new RTCSessionDescription(data.answer));



 

});


// ICE layer
peer.onicecandidate = (event) => {
  sendIceCandidate(event);
}

socket.on('remotePeerIceCandidate', async (data) => {
  try {
    const candidate = new RTCIceCandidate(data.candidate);
    await peer.addIceCandidate(candidate);
  } catch (error) {
    // Handle error, this will be rejected very often
  }
})

peer.addEventListener('track', (event) => {
  const [stream] = event.streams;
  document.querySelector('#remoteVideo').srcObject = stream;
})

let selectedUser;

const sendMediaAnswer = (peerAnswer, data) => {
  socket.emit('mediaAnswer', {
    answer: peerAnswer,
    from: socket.id,
    to: data.from
  })
}

const sendMediaOffer = (localPeerOffer) => {
  socket.emit('mediaOffer', {
    offer: localPeerOffer,
    from: socket.id,
    to: selectedUser
  });
};

const sendIceCandidate = (event) => {
  socket.emit('iceCandidate', {
    to: selectedUser,
    candidate: event.candidate,
  });
}

const onUpdateUserList = ({ userIds }) => {
  const usersList = document.querySelector('#usersList');
  const usersToDisplay = userIds.filter(id => id !== socket.id);

  usersList.innerHTML = '';

  usersToDisplay.forEach(user => {
    const userItem = document.createElement('div');
    userItem.innerHTML = user;
    userItem.className = 'user-item';
    userItem.addEventListener('click', () => {
      const userElements = document.querySelectorAll('.user-item');
      userElements.forEach((element) => {
        element.classList.remove('user-item--touched');
      })
      userItem.classList.add('user-item--touched');
      selectedUser = user;
    });
    usersList.appendChild(userItem);
  });
};
socket.on('update-user-list', onUpdateUserList);

const handleSocketConnected = async () => {
  onSocketConnected();
  socket.emit('requestUserList');
};

socket.on('connect', handleSocketConnected);