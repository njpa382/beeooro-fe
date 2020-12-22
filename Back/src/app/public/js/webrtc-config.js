const getCam = () => {
  return navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
};

const addRemoteVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  contentVideo.append(video);
};

// WEBRTC API
// To iron over browser implementation anomalies like prefixes
// soluciona anomalías de implementación del navegador como prefijos
GetRTCPeerConnection();
GetRTCSessionDescription();
GetRTCIceCandidate();

//prepare the caller to use peerconnection
prepareCaller();

function prepareCaller() {
  //Initializing a peer connection
  caller = new RTCPeerConnection();

  //Listen for ICE Candidates and send them to remote peers
  caller.onicecandidate = (e) => {
    if (!e.candidate) return;
    console.log("onicecandidate called");
    onIceCandidate(caller, e);
  };

  //ontrack handler to receive remote feed and show in remoteview video element
  // metodo que muestra video remoto
  caller.ontrack = (e) => {
    console.log("ontrack called");
    if (window.URL) {
      console.log("mostrando video remoto");
      addRemoteVideoStream(remoteView, e.streams[0]);
    } else {
      remoteView.src = e.streams;
    }
  };
}

function GetRTCIceCandidate() {
  window.RTCIceCandidate =
    window.RTCIceCandidate ||
    window.webkitRTCIceCandidate ||
    window.mozRTCIceCandidate ||
    window.msRTCIceCandidate;

  return window.RTCIceCandidate;
}

function GetRTCPeerConnection() {
  window.RTCPeerConnection =
    window.RTCPeerConnection ||
    window.webkitRTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.msRTCPeerConnection;

  return window.RTCPeerConnection;
}

function GetRTCSessionDescription() {
  window.RTCSessionDescription =
    window.RTCSessionDescription ||
    window.webkitRTCSessionDescription ||
    window.mozRTCSessionDescription ||
    window.msRTCSessionDescription;

  return window.RTCSessionDescription;
}

//Create and send offer to remote peer on button click
// Realizar llamada
function callUser(user) {
  getCam()
    .then((stream) => {
      if (window.URL) {
        console.log("habilitando mi camara");
        addVideoStream(myVideo, stream);
      } else {
        myVideo.src = stream;
      }
      toggleEndCallButton(
        document.getElementById("makeCall"),
        document.getElementById("endCall")
      );
      stream.getTracks().forEach((track) => caller.addTrack(track, stream));
      localUserMedia = stream;
      caller.createOffer().then((offer) => {
        caller.setLocalDescription(new RTCSessionDescription(offer));
        channel.trigger("client-sdp", {
          sdp: offer,
          room: user,
          from: id,
        });
        room = user;
      });
    })
    .catch((error) => {
      console.log("an error occured", error);
    });
}

//Send the ICE Candidate to the remote peer
function onIceCandidate(peer, e) {
  if (e.candidate) {
    channel.trigger("client-candidate", {
      candidate: e.candidate,
      room: room,
    });
  } else {
    console.log("Unable to send ICE candidate to remote peer");
  }
}

// vinculamos al candidate y se agrega el IceCandidate al actual RTCPeerConnection
channel.bind("client-candidate", function (msg) {
  if (msg.room === room) {
    try {
      console.log("candidate received");
      caller.addIceCandidate(new RTCIceCandidate(msg.candidate));
    } catch (err) {
      console.error("Error adding received ice candidate", err);
    }
  }
});

function toggleEndCallButton(element1, element2) {
  if (element1.className === "active") {
    element1.classList.toggle("inactive");
    element2.className = "active";
  }
}

// Recibiendo llamada
channel.bind("client-sdp", function (msg) {
  if (msg.room == id) {
    let answer = confirm(
      "You have a call from: " + msg.from + "Would you like to answer?"
    );
    if (!answer) {
      return channel.trigger("client-reject", {
        room: msg.room,
        rejected: id,
      });
    }
    room = msg.room;
    getCam()
      .then((stream) => {
        localUserMedia = stream;
        toggleEndCallButton(
          document.getElementById("makeCall"),
          document.getElementById("endCall")
        );
        if (window.URL) {
          console.log("habilitando camara receptor");
          addVideoStream(myVideo, stream);
        } else {
          myVideo.src = stream;
        }
        stream.getTracks().forEach((track) => caller.addTrack(track, stream));
        let sessionDesc = new RTCSessionDescription(msg.sdp);
        caller.setRemoteDescription(sessionDesc);
        caller.createAnswer().then(function (sdp) {
          caller.setLocalDescription(new RTCSessionDescription(sdp));
          channel.trigger("client-answer", {
            sdp: sdp,
            room: room,
          });
        });
      })
      .catch((error) => {
        console.log("an error occured", error);
      });
  }
});

channel.bind("client-answer", function (answer) {
  if (answer.room === room) {
    console.log("answer received");
    caller.setRemoteDescription(new RTCSessionDescription(answer.sdp));
  }
});

channel.bind("client-reject", function (answer) {
  if (answer.room === room) {
    console.log("Call declined");
    alert("call to " + answer.rejected + "was politely declined");
    endCall();
  }
});

function endCall() {
  room = undefined;
  caller.close();
  for (let track of localUserMedia.getTracks()) {
    track.stop();
  }
  prepareCaller();
  toggleEndCallButton(
    document.getElementById("endCall"),
    document.getElementById("makeCall")
  );
}

function endCurrentCall() {
  channel.trigger("client-endcall", {
    room: room,
  });

  endCall();
}
