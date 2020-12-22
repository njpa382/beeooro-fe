Pusher.logToConsole = true;

// New Pusher Instance
// colocar PUSHER_API_KEY
// colocar PUSHER_CLUSTER
let pusher = new Pusher("dc3f6094144e4ad6325c", {
  cluster: "eu",
  encrypted: true,
  authEndpoint: "api/v1/beeooro-calls/pusher/auth",
});

pusher.connection.bind("connected", () => console.log("connected"));

pusher.connection.bind("error", (error) =>
  console.error("connection error", error)
);

// Channel subscription
const channel = pusher.subscribe("presence-videocall");
console.log(channel);

channel.bind("pusher:subscription_succeeded", (members) => {
  //set the member count - recuento de usuarios
  usersOnline = members.count;
  id = channel.members.me.id;
  console.log(`My id: ${id}`);
  // adding members to the users matrix
  members.each((member) => {
    if (member.id != channel.members.me.id) {
      users.push(member.id);
    }
    console.log(users);
  });

  render();
});

// Add new members
channel.bind("pusher:member_added", (member) => {
  users.push(member.id);
  render();
});

// Remove disconnected members from the array
channel.bind("pusher:member_removed", (member) => {
  // for remove member from list:
  let index = users.indexOf(member.id);
  users.splice(index, 1);
  if (member.id == room) {
    endCall();
  }
  render();
});
