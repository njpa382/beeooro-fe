// Initial variables
const videoGrid = document.getElementById("video-grid");
const contentVideo = document.getElementById("content-video");
const myVideo = document.getElementById("myVideo");
const remoteView = document.createElement("video");
myVideo.muted = true;
remoteView.muted = true;

let usersOnline,
  id,
  users = [],
  sessionDesc,
  currentcaller,
  room,
  caller,
  myVideoStream,
  localUserMedia;

// Function that shows users online
function render() {
  let list = "";
  users.forEach(function (user) {
    list += `
                <li> 
                    ${user}
                    <button 
                        type="button" style="float:right;" 
                        onclick="callUser('${user}')" id="makeCall"
                        class="active"
                    >
                        Call
                    </button>
                </li>
            `;
  });
  document.getElementById("users").innerHTML = list;
}
