// Creating the peer


class Peer_to_Peers_Connection {
  constructor(token) {

    console.log('token inside', token)
    this.user = token.user
    this.connection_map
  }


  connection_id() {

  }


  connect() {

    let [message_history, message_box] = [[], document.getElementById("message_history")]
    let chat_input = document.getElementById("chat_input")

    function update_message_box(message) {
      message_history.unshift(message)
      message_box.innerHTML = message_history.map(val => `<li>${val}</li>`).join(" ")
      message_box.scrollIntoView();
    }




    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        }
      ]
    });

 




    const channel = peer.createDataChannel("chat")

    channel.onopen = function (event) {
      chat_input.addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
          channel.send(event.target.value)
          console.log("channell-.>>", channel)
          update_message_box(event.target.value)
          event.target.value = ""
        }
      })
      channel.send('Hi you!');
    }

    channel.onmessage = function (event) {
      console.log("event->>", event);
      update_message_box(event.data)
    }

    peer.ondatachannel = function (event) {
      let event_channel = event.channel;
      event_channel.onopen = function (event) {

        chat_input.addEventListener('keydown', (event) => {
          if (event.key === "13") {
            update_message_box(event.target.value)
            event_channel.send(event.target.value)
            event.target.value = ""
          }
        })
        event_channel.send('Hi back!');
      }

      event_channel.onmessage = function (event) {
        console.log("message", event)
        update_message_box(event.data)

      }
    }






    // Connecting to socket

    const socket = io(window.location.host, {
      query: this.user,
      withCredentials: true,
      extraHeaders: {

        "Access-Control-Allow-Origin": "*"
      }
    });



    socket.on('connect', async () => {
      document.getElementById("currentId").innerText = this.user.email;
      const constraints = {
        audio: true,
        video: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
     
      document.querySelector('#localVideo').srcObject = stream;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      socket.emit('requestUserList');

    });







    let selectedUser;

    document.addEventListener('click', async (event) => {
      const target = event.target
      if (target.matches("#call")) {
        // peer.close()
      }
      if (target.parentElement.matches("#usersList")) {
        const localPeerOffer = await peer.createOffer();
        await peer.setLocalDescription(new RTCSessionDescription(localPeerOffer));

        const userElements = document.querySelectorAll('.user-item');
        userElements.forEach((element) => {
          element.classList.remove('user-item--touched');
        });
        target.classList.add('user-item--touched');




        selectedUser = target.innerText;
        socket.emit('mediaOffer', {
          offer: localPeerOffer,
          from: this.user.email,
          to: target.innerText
        });
      }
    });


    // Create media offer
    socket.on('mediaOffer', async (data) => {
   
      await peer.setRemoteDescription(new RTCSessionDescription(data.offer));
      const peerAnswer = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(peerAnswer));

      socket.emit('mediaAnswer', {
        answer: peerAnswer,
        from: this.user.email,
        to: data.from
      })


    });


 // Create media answer
    socket.on('mediaAnswer', async (data) => {
      await peer.setRemoteDescription(new RTCSessionDescription(data.answer));

    });

 // ICE layer
    peer.onicecandidate = (event) => {
      socket.emit('iceCandidate', {
        to: selectedUser,
        candidate: event.candidate,
      });
    }

    socket.on('remotePeerIceCandidate', async (data) => {
      try {
        const candidate = new RTCIceCandidate(data.candidate);
        console.log("candidate : ",candidate.toJSON())
        await peer.addIceCandidate(candidate);
      } catch (error) {
        // Handle error, this will be rejected very often
      }
    })


   

    let videos = {};


    peer.addEventListener('track', (event) => {

      let stream = event.streams[event.streams.length - 1]

      if (videos[stream.id]) {

        videos[stream.id].srcObject = stream;

        return;

      }

      const container = document.querySelector('#remoteVideo')
      let pair = document.createElement('div')
      let details = document.createElement("div")
      details.innerText = stream.id + " socketId:";
        container.appendChild(pair)
      let video = document.createElement("video")
      video.setAttribute("playsinline", "")
      video.setAttribute("autoplay", "");
      videos[stream.id] = video;

      pair.appendChild(details)
      pair.appendChild(video)
    
      video.classList.add("remoteVideo")
      videos[stream.id].srcObject = stream;

    })




    socket.on('update-user-list', ({ userIds }) => {
      
              
      const usersList = document.querySelector('#usersList');
      
    
      usersList.innerHTML = '';
      while(userIds.length){
      const user  = userIds.pop();
        if(user !== this.user.email){
        const userItem = document.createElement('div');
        userItem.innerHTML = user;
        userItem.className = 'table-view-cell user-item ';
        usersList.appendChild(userItem);
        }
      };
    });



  }

}