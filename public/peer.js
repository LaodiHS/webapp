// Creating the peer




class Element_Grid {



  constructor(DOM, element) {

    let sub1 = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 3, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }];
    let sub2 = [{ x: 0, y: 0 }, { x: 0, y: 1, w: 2 }];

    let subOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
    };

    let options = { // main grid options
      column: 'auto', // will auto switch on smaller screens
      cellHeight: 50, // make sure we have a decent height and not width/12 for 1 column
      alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      row: 'auto',
      margin: 5,
      minRow: 4, // don't collapse when empty
      acceptWidgets: true,
      id: 'main',
      children: [

      ]
    };
    const videoLayout = {
      w: 2,
      auto_x: 0,
      h: 6,
      y: 0,
      add_x: () => {
        videoLayout.auto_x += videoLayout.w
        return videoLayout.auto_x;
      },
      add_y: () => {
        videoLayout.auto_y += videoLayout.h
        return videoLayout.auto_y;
      }

    }
    this.video_coordinates = videoLayout;
    let el = DOM.querySelector(element)

    this.gridStack = GridStack.addGrid(el,options);

  }



  add_video_widget(video_element, connected_peer, options = {}) {


    let subOptions = {
      cellHeight: 50, // should be 50 - top/bottom
      column: 'auto', // size to match container. make sure to include gridstack-extra.min.css
      acceptWidgets: true, // will accept .grid-stack-item by default
      margin: 5,
    };
    Object.assign(subOptions, options)
    let widget = this.gridStack.addWidget({
      x: this.video_coordinates.auto_x, y: 0, w: this.video_coordinates.w, h: this.video_coordinates.h, id: `widget-${connected_peer}`,
      content: `<video></video><div style="font-size:11px"> user: ${connected_peer.split("@").shift()} 
       </div> <button class="btn" style="height:25px" remove_user="${connected_peer}" > close </button> `, class: 'sub3', ...subOptions
    });
    this.video_coordinates.auto_x += this.video_coordinates.w
    widget.querySelector('video').replaceWith(video_element)

  }

}





// Connecting to socket

class Peer_to_Peers_Connection {


  constructor() {




    this.connection_map
    this.remote_video_options = new Map();
    this.stream;
    this.videos = {};
    this.localStream;
    this.peers = {};

    this.connection_configuration = {
      iceServers: [
        { urls: "stun:stun.stunprotocol.org" },
        { 'urls': 'stun:stun.l.google.com:19302' }
      ]
    }
  }

  RtcpClientConnect(connected_peer_user, connection_configuration, current_session_user_object, socket, DOM, stream) {
    try {
      this.peers[connected_peer_user] = new RTCPeerConnection(connection_configuration);
      stream.getTracks().forEach(track => this.peers[connected_peer_user].addTrack(track, stream));
      this.onIceCandidate(connected_peer_user, current_session_user_object, socket)
      this.create_remote_video_element(connected_peer_user)
      this.onIceConnectionStateChange(connected_peer_user)
      this.onDataChannel(connected_peer_user, current_session_user_object, DOM)


    } catch (error) {
      console.log(error)
    }

  }

  update_message_box(user, message, DOM) {

    let [message_history, message_box] = [[], document.querySelector("#message_history")]
    let chat_input = document.querySelector("#chat_input")
    message_history.push(message)
    message_box.insertAdjacentHTML('beforeend', `<span class="update_message_box" style="display:grid; grid-template-columns:1fr 5fr 28fr">
    <span class="btn">${user}</span> <span class="">${message}</span></span> <br/>`)
    message_box.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }

  // ICE layer
  onIceCandidate(user_t, current_user, socket) {
    const peer = user_t;
    this.peers[peer].onicecandidate = (event, from_user = current_user, to_user = peer) => {

      socket.emit('iceCandidate', {
        from: from_user,
        to: to_user,
        candidate: event.candidate,
      });
    }
  }


  onDataChannel(connected_peer_user, current_session_user_object, DOM_) {
    const channel = this.peers[connected_peer_user].createDataChannel("data_channel")
    this.peers[connected_peer_user].channel_session = channel;
    this.peers[connected_peer_user].ondatachannel = (event, user = connected_peer_user, current_user = current_session_user_object, DOM = DOM_) => {
      let event_channel = event.channel;


      event_channel.onopen = (even, dom = DOM) => {
        console.log('on open ', event)
        chat_input.addEventListener('keydown', (event, elementNodes = dom) => {
          if (event.key === "Enter") {

            for (const peer in this.peers) this.peers[peer].channel_session.send(event.target.value);

            this.update_message_box(user.split("@")[0], event.target.value)
            event.target.value = ""


        

          }
        })
        channel.send("has connected");
      }



      event_channel.onmessage = (event, dom = DOM) => {
        console.log("on message", event)
        document.querySelector("#message_history").scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })

        this.update_message_box(user.split("@")[0], event.data, dom)

      }
      event_channel.onclose = (event) => {
        console.log('close_event:', event)
        console.log("datachannel close");
      };


    }
  }


  onIceConnectionStateChange(connected_peer_user) {

    this.peers[connected_peer_user].oniceconnectionstatechange = (event, selected_peer = connected_peer_user) => {

      var state = this.peers[selected_peer].iceConnectionState;
      console.log(`connection with peer ${selected_peer} ${state}`);

      if (state === "failed" || state === "closed" || state === "disconnected") {

        this.closeVideo('close_video', selected_peer)

      }
    }
  }




  closeVideo(target, selected_peer) {
    let remove_element = target instanceof HTMLElement && target.getAttribute('remove_user')
    remove_element = remove_element || target === "close_video"
    selected_peer = selected_peer || target.getAttribute('remove_user')

    if (remove_element) {

      let remote_video = document.querySelector(`[remove_video_id="${selected_peer}"]`)

      remote_video.srcObject.getVideoTracks().forEach(track => {
        track.stop()
        remote_video.srcObject.removeTrack(track)
      })

      const video_widget = document.querySelector(`[gs-id="widget-${selected_peer}"]`)
      this.video_grid.gridStack.removeWidget(video_widget)
      if(this.peers[selected_peer]){
      this.peers[selected_peer].close()
       delete this.peers[selected_peer];
      }
     
      Array.from(document.querySelectorAll(".user-item--touched")).forEach(element => element.classList.toggle('user-item--touched'))
      return false;
    }


    return true
  }


  create_remote_video_element(connected_peer_user, DOM) {
    let videos = this.videos


    this.peers[connected_peer_user].addEventListener('track', (event, connected_peer = connected_peer_user) => {
      let stream = event.streams[event.streams.length - 1]


      const video = document.createElement("video")
      video.style.setProperty("width", "100%")

      videos[stream.id] = video
      videos[stream.id].srcObject = stream;
      video.setAttribute('remove_video_id', connected_peer)

      video.setAttribute("controls", "true")
      video.setAttribute("playsinline", "")
      video.setAttribute("autoplay", "true");
      videos[stream.id] = video;

      videos[stream.id].srcObject = stream;
      video.play()
      const widget = this.video_grid.add_video_widget(video, connected_peer)
      return widget;

    })
  }

  async connect({ user }, DOM) {
    let stream
    const socket = io(window.location.host, {
      query: user,
      withCredentials: true,
      extraHeaders: {
        "Access-Control-Allow-Origin": "*"
      }
    });



    this.video_grid = new Element_Grid(DOM, '#remoteVideo')
    const video_grid = this.video_grid.gridStack;



    socket.on('connect', async () => {
      const constraints = {
        audio: false,
        video: true
      };

      stream = await navigator.mediaDevices.getUserMedia(constraints);


      let localVideo = document.createElement('video')
      localVideo.srcObject = stream;
      localVideo.style.setProperty("width", "100%")


      localVideo.setAttribute('remove_video_id', user.email)

      localVideo.setAttribute("controls", "true")
      localVideo.setAttribute("playsinline", "")
      localVideo.setAttribute("autoplay", "");
      this.video_grid.add_video_widget(localVideo, user.email, { noResize: true, locked: true })

   
      socket.emit('requestUserList');
    });


    document.addEventListener('click', async (event) => {
      const target = event.target



      const connected_user = target.getAttribute('connectUserId');
      if (this.closeVideo(target) && connected_user) {


        this.RtcpClientConnect(connected_user, this.connection_configuration, user, socket, DOM, stream)

        const localPeerOffer = await this.peers[connected_user].createOffer();
        await this.peers[connected_user].setLocalDescription(new RTCSessionDescription(localPeerOffer));

        const userElements = document.querySelectorAll('.user-item');
        userElements.forEach((element) => {
          element.classList.remove('user-item--touched');
        });

        target.classList.add('user-item--touched');

        socket.emit('mediaOffer', {
          offer: localPeerOffer,
          from: user.email,
          to: connected_user
        });
      }
    });


    // Create media offer
    socket.on('mediaOffer', async (data) => {
      const from = data.from;
      this.RtcpClientConnect(from, this.connection_configuration, user, socket, DOM, stream)

      await this.peers[from].setRemoteDescription(new RTCSessionDescription(data.offer));
      const peerAnswer = await this.peers[from].createAnswer();
      await this.peers[from].setLocalDescription(new RTCSessionDescription(peerAnswer));

      socket.emit('mediaAnswer', {
        answer: peerAnswer,
        from: user.email,
        to: data.from
      })

    });

    socket.on('mediaAnswer', async (data) => {
      await this.peers[data.from].setRemoteDescription(new RTCSessionDescription(data.answer));
    });

    socket.on('remotePeerIceCandidate', async (data) => {

      try {
        const candidate = new RTCIceCandidate(data.candidate);
        await this.peers[data.from.email].addIceCandidate(candidate);
      } catch (error) {
        console.log('error: ', error)
      }

    })


    function save(content = true, full = true) {
      options = grid.save(content, full);
      console.log(options);
      // console.log(JSON.stringify(options));
    }



    this.selection_grid = new Element_Grid(DOM, '#selection_grid')
    const selection_grid = this.selection_grid.gridStack;


    this.chat_grid = new Element_Grid(DOM, '#chat_grid')
    const chat_grid= this.chat_grid.gridStack;



    let h = 3





    const grid = new gridjs.Grid({
      data: ["name"],
      language:{
        noRecordsFound:'No Online Users'
      }
      })



    let widget = selection_grid.addWidget({
      x: 0, y: h, w: 12, h: 3, content: `<div id="usersList" class=""></div>`,
      noResize: true
    });

    const usersList = widget.querySelector("#usersList")
    grid.render(usersList)
    h += h;






    // chat_grid.addWidget({
    //   x: 0, y: h, w: 12, h: 2, content: `
    
    // <div class="message_history">
    // <ul id="message_history"></ul>
    // </div>
    //  `, noResize: true, locked: false


    // })
    h += h;

    // chat_grid.addWidget({
    //   x: 0, y: 12, w: 12, h: 3, content: `
    
    // <input class="chat" type="text" placeholder="chat with me, me friend"
    //  id="chat_input" />
    //  `, noResize: true, locked: false


    // })










    

    socket.on('update-user-list', async ({ userIds }) => {
      userIds = userIds.filter(email => email !== user.email)
      grid.updateConfig({
        columns: [
          {
            name: `${user.email.split("@").shift()} Online Users`,

          }

        ],
        data: userIds.map(userId =>
          [
            gridjs.html(`<div style='padding: 2px; border: 1px solid #ccc;border-radius: 4px;'>
            <center connectUserId=${userId} >${userId.split("@").shift()}</center> </div>`)
          ]
        )

      }
      ).forceRender();

    });



    socket.on('disconnect', () => {
      const token = sessionStorage.getItem("user_token")
      const session = token ? JSON.parse(token) : false;
      if (!session) {
        socket.disconnect()
      }

    })




  }

}


