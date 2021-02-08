import React, { useEffect, useState } from "react"
import axios from 'axios';
import { connect, createLocalVideoTrack } from 'twilio-video';
import Header from './components/Header'
import Main from './components/Main'

function App() {

  const [token, setToken] = useState('')
  const [room, setRoom] = useState('')

  useEffect(() => {
    getData()
  }, [])

  const getData = async () => {
    const res = await axios.get('http://localhost:4000/api/v1/twilio/token')
    const data = res.data.token 
    setToken(data)
  }

  const handleChange = (e) => {
    setRoom( e.target.value )
  }

  const addRoom = async (e) => {
    e.preventDefault()
    const newRoom = {
      uniqueName: room
    } 

    try {
      await axios.post('http://localhost:4000/api/v1/twilio/addRoom', newRoom)    
    } catch (error) {
      console.log(error, 'room name exist')
    }

    setRoom('')
  } 

  const joinRoom = async (e) => {
    e.preventDefault()
    const TOKEN = token.token
    console.log(TOKEN)
    
    connect(TOKEN, { name: room }).then(room => {
      console.log(`Successfully joined a Room: ${room.name}`)
      const videoChat = document.getElementById('video-chat');

      createLocalVideoTrack().then(track => {
          videoChat.appendChild(track.attach());
      });
      room.on('participantConnected', participant => {
        console.log(`A remote Participant connected: ${participant}`);
        participant.tracks.forEach(publication => {
          if (publication.isSubscribed) {
            const track = publication.track
            videoChat.appendChild(track.attach())
          }
        })
        participant.on('trackSubscribed', track => {
          videoChat.appendChild(track.attach());
        });
      })  
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
  }

  return (
    <div className="App">  
      <Header/>
      <Main/>
       <h1>Beeooro</h1>
       <form onSubmit={addRoom}>
         <input 
          type="text" 
          name="uniqueName"
          placeholder="Room Name"
          onChange={handleChange}
          value={room}  
        />
       <button type="submit">
         Create Room
       </button>
       </form>
       <form onSubmit={joinRoom}>
         <input 
          type="text" 
          name="uniqueName"
          placeholder="Room Name"
          onChange={handleChange}
          value={room}  
        />
       <button type="submit">
         Join Room
       </button>
       </form>
       <div id="video-chat"/>
    </div>
  )
}

export default App
