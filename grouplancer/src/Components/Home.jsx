import React from 'react';
import About from './About';

const Home = (props) => {
  const { bgcolor } = props;
  const cardcolor = "#dfdffb";
  return (
    <div style={{ backgroundColor: bgcolor }}>
      <div id="frontimage">
<<<<<<< HEAD
        {/* <img src="./grouplace-logo_3.png" style={{zIndex: "1"}}/> */}
        <h1 style={{color: "white", paddingTop: "100px", marginLeft: "100px", }}>Grouplance</h1>
=======
        <img src="./grouplan2.png" alt="pictu" />
>>>>>>> fc65963914146cf8c94261d13fc2092f80d29a20
        <p style={{color: "white", width: "400px", marginLeft: "100px", paddingTop: "400px", textAlign: "justify"}}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat autem accusamus doloribus beatae accusantium. Ea molestias doloremque aspernatur numquam explicabo ipsa excepturi accusantium. Sapiente fuga doloremque sit totam architecto incidunt!</p>
        <button type='submit' id='community'>Join the community</button>
      </div>
      <div id='cards'>
        <br></br>
        <About cardcolor={cardcolor} />
      </div>
    </div>

  )
}

export default Home