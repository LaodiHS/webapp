// Creating the peer


class Peer_to_Peers_Connection {
  constructor(token) {

    console.log('token inside', token)
    this.user = token.user
    this.connection_map
    this.remote_video_options = new Map();
    this.stream;
    this.videos = {};
    this.pcs = {};
    this.connection_configuration = {
      iceServers: [
        {
          urls: "stun:stun.stunprotocol.org"
        },
        { 'urls': 'stun:stun.l.google.com:19302' }
      ]
    }

  }
  get_pc(id) {
    return this.pcs[id]
  }

  link_peers(id) {
    if (!this.pcs[id]) {
      const peer = new RTCPeerConnection(this.connection_configuration);
      this.pcs[id] = peer
      return this.pcs[id]
    }
    return this.pcs[id]
  }

  connect() {

    let [message_history, message_box] = [[], document.getElementById("message_history")]
    let chat_input = document.getElementById("chat_input")

    function update_message_box(message) {
      message_history.push(message)
      message_box.innerHTML = message_history.map(val => `<li>${val}</li>`).join(" ")
      message_box.scrollIntoView();
    }










    const peer = new RTCPeerConnection(this.connection_configuration);






    const channel = peer.createDataChannel("chat")




    peer.ondatachannel = (event) => {
      let event_channel = event.channel;
      event_channel.onopen = (event) => {
        console.log('on open ', event)
        chat_input.addEventListener('keydown', (event) => {
          if (event.key === "Enter") {
            channel.send(this.user.email.split("@")[0] + " : " + event.target.value)

            update_message_box(this.user.email.split("@")[0] + " : " + event.target.value)
            event.target.value = ""
          }
        })
        channel.send("connected to" + " : " + this.user.email.split("@")[0]);
      }

      event_channel.onmessage = (event) => {
        console.log("on message", event)
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



      setTimeout(async () => {


        socket.emit('requestUserList');
        document.getElementById("currentId").innerText = this.user.email;
        const constraints = {
          audio: true,
          video: true
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        const localVideo = document.querySelector('#localVideo')
        localVideo.srcObject = stream;
        // localVideo.play();
        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        this.stream = stream;
      }, 100)
    });







    let selectedUser;

    document.addEventListener('click', async (event) => {
      const target = event.target

      if (target.matches("button")) {
        let remote_video = this.remote_video_options(target)
        remote_video.current.srcObject.getVideoTracks().forEach(track => {
          track.stop()
          remote_video.current.srcObject.removeTrack(track)

        })

        remote_video.parentElement.remove();

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
        // console.log("candidate : ", candidate.toJSON())
        await peer.addIceCandidate(candidate);
      } catch (error) {
        // Handle error, this will be rejected very often
      }
    })







    peer.addEventListener('track', (event) => {

      let stream = event.streams[event.streams.length - 1]
      this.videos = this.videos || {};
      if (this.videos[stream.id]) {

        this.videos[stream.id].srcObject = stream;

        return;

      }

      const container = document.querySelector('#remoteVideo')
      let pair = document.createElement('div')
      let details = document.createElement("div")
      let video = document.createElement("video")
      let exit_button = document.createElement("button");

      this.remote_video_options.set(exit_button, video);
      exit_button.innerText = "end call";
      details.innerText = stream.id + " socketId:";

      container.appendChild(pair)

      video.setAttribute("playsinline", "")
      video.setAttribute("autoplay", "");
      this.videos[stream.id] = video;

      pair.appendChild(details)
      pair.appendChild(video)

      video.classList.add("remoteVideo")

      this.videos[stream.id].srcObject = stream;
      video.play()
    })




    socket.on('update-user-list', async ({ userIds }) => {


      const usersList = await domElementLoaded('#usersList');


      usersList.innerHTML = '';
      while (userIds.length) {
        const user = userIds.pop();
        if (user !== this.user.email) {
          this.link_peers(user)
          const userItem = document.createElement('div');
          userItem.innerHTML = user;
          userItem.className = 'table-view-cell user-item ';
          usersList.appendChild(userItem);
        }
      };
    });



    socket.on('disconnect', () => {
      const token = localStorage.getItem("user_token")
      const user = token ? JSON.parse(token) : false;
      if (!user) {
        socket.disconnect()
      }

    })

    async function domElementLoaded(element) {
      let step = 100;


      return await new Promise((resolve, reject) => {

        let element_find = (element) => {

          let el = document.querySelector(element)
          if (el) {
            resolve(el);
            return true;

          }
          if (step-- <= 0) {
            reject(false)
            return false;
          }
          window.requestAnimationFrame(findElement(element))
        }

        element_find(element);

      })


    }


  }

}


