import React, { useEffect, useState } from "react";
import axios from 'axios';
//import { connect } from 'twilio-video';

function App() {

  const [token, setToken] = useState('')
  //const [room, setRoom] = useState('')

  useEffect(() => {
      getData()
  }, [])

  const getData = async () => {
    const res = await axios.get('http://localhost:4000/api/v1/twilio/token')
    const data = res.data.token 
    console.log(res.data)

    setToken(data)
  }

  /* const addRoom = async () => { 
    const res = await axios.post('http://localhost:4000/api/v1/twilio/addRoom')
     
  } */ 


  return (
    <div className="App">
       <h1>Beeooro</h1>
    </div>
  );
}

export default App;
