import React, { useEffect, useState } from "react"
import axios from 'axios';
import { connect } from 'twilio-video';

function App() {

  const [token, setToken] = useState('')
  const [room, setRoom] = useState('')

  useEffect(() => {
     getData()
  }, [])

  const getData = async () => {
    const res = await axios.get('http://localhost:4000/api/v1/twilio/token')
    const data = res.data.token 
    console.log(res.data.token)

    setToken(data)
  }

  const handleChange = (e) => {
    // const { name, value } = e.target
    setRoom( e.target.value )
  }

  const addRoom = async () => {
    const newRoom = {
      uniqueName: room
    }
     
    await axios.post('http://localhost:4000/api/v1/twilio/addRoom', newRoom)
    
    setRoom('')
  } 

  const joinRoom = (e) => {
    e.preventDefault()
    console.log(token.token)
    const TOKEN = token.token
    connect(TOKEN, { name: 'room test' }).then(room => {
      /* Reviar Unable to connect to Room: Invalid Access Token grants */
      console.log(`Successfully joined a Room: ${room}`);
      /* room.on('participantConnected', participant => {
        console.log(`A remote Participant connected: ${participant}`);
      }); */
    }, error => {
      console.error(`Unable to connect to Room: ${error.message}`);
    });
  }

  return (
    <div className="App">
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
    </div>
  )
}

export default App
