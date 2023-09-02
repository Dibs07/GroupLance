import React from 'react';
import About from './About';

const Home = (props) => {
  const { bgcolor } = props;
  const cardcolor = "#dfdffb";
  return (
    <div style={{ backgroundColor: bgcolor }}>
      <div id="frontimage">
        <p style={{width: "400px", color: "white", fontSize: "35px", marginLeft: "100px", paddingTop: "150px", marginBottom: "-180px", fontWeight: "bold"}}>Hello, this is a freelancing website</p>
        <p style={{ color: "white", width: "400px", marginLeft: "100px", paddingTop: "200px", textAlign: "justify" }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quaerat autem accusamus doloribus beatae accusantium. Ea molestias doloremque aspernatur numquam explicabo ipsa excepturi accusantium. Sapiente fuga doloremque sit totam architecto incidunt!</p>
        <button type='submit' id='community'>Join the community</button>
      </div>
      <div id='cards'>
        <br></br>
        <About cardcolor={cardcolor} />
        <br></br>
      </div>
    </div>

  )
}

export default Home