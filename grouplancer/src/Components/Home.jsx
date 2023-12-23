import React from "react";
import About from "./About";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";


const Home = (props) => {
  const { bgcolor } = props;
  const cardcolor = "#dfdffb";
  const { currentUser } = useUser();
  let navigate = useNavigate();
  const handleClick = () => {
    console.log(currentUser);
    if (!currentUser) {
      navigate("/login");
    }
    else {
      navigate("/livegroups");
    }
  }

  return (
    <div style={{ backgroundColor: bgcolor }}>
      <div id="frontimage">
        <p
          style={{
            width: "400px",
            color: "white",
            fontSize: "30px",
            marginLeft: "100px",
            paddingTop: "120px",
            marginBottom: "-180px",
            fontWeight: "bold",
          }}
        >
          Find and Connect with like-minded individuals and create or join groups effortlessly, online.
        </p>
        <p
          style={{
            color: "white",
            width: "400px",
            marginLeft: "100px",
            paddingTop: "200px",
            textAlign: "justify",
          }}
        >
          <ul>
            <li>Endless Group Possibilities, One Click Away</li>
            <li>Free Sign-Up, No Hidden Costs</li>
            <li>Pay For Premium Features </li>
            <li>Secure, Global Community Connections</li>
            <li>Chat And Connect With Others</li>
          </ul>
        </p>
        <button type="submit" className="community" onChange={handleClick}>
          Join the community
        </button>
      </div>
      <div id="cards">
        <br></br>
        <About cardcolor={cardcolor} />
        <br></br>
      </div>
      <div class="row">
        <div class="col-sm-4" style={{paddingLeft:"250px",alignItems:"center",borerRadius:"20px"}}>
          <div class="card" style={{backgroundImage: "linear-gradient(to right , #b0fc38, #ffff", width:"300px",height:"400px",backgroundColor:"white",borderColor:"green",boxShadow:"0 0 5px 5px"}}>
            
            <img src="./free-tag-icon-business-bicolor-260nw-286152590.jpg" alt="icon" style={{marginLeft:"85px",marginTop:"10px"}}/>
            <h3 style={{paddingLeft:"70px",paddingBottom:"5px",paddingTop:"10px"}}>Try for free</h3>
            <ui style={{marginBottom:"40px",marginTop:"30px",paddingLeft:"20px"}} >
              <li style={{}}>Ad free</li>
              <li>Create only one group</li>
              <li>Create groups of only specified size</li>
             
            </ui>
          <button type="button" class="btn btn-outline-primary"  style={{color:"white",backgroundColor:"green",width:"140px",height:"50px",borderRadius:"10px",marginBottom:"300px",marginLeft:"70px"}}>free</button>
          </div>
          <div class="card-body">
            
          </div>
        </div>
        <div class="col-sm-4" style={{paddingLeft:"130px",alignItems:"center",borerRadius:"20px"}}>
          <div class="card" style={{backgroundImage: "linear-gradient(to right , #dcb951, #ffff", width:"300px",height:"400px",borerRadius:"20px",boxShadow:"0 0 5px 5px"}}>
           
            <img src="./Premium-Icon-600x600-1.png" alt="icon" style={{marginLeft:"85px",width:"120px",height:"120px",marginTop:"2px"}}/>
            <h3 style={{paddingLeft:"50px",paddingBottom:"5px",paddingTop:"10px"}}>Just for 700/-</h3>
            <ui style={{marginBottom:"40px",marginTop:"20px" ,paddingLeft:"20px"}} >
              <li style={{listStyle:"inherit"}}>Ad free</li>
              <li>Create multiple groups</li>
              <li>Create groups of any size</li>
              
            </ui>
          <button type="button"  class="btn btn-outline-primary"  style={{color:"white",backgroundColor:"brown",width:"140px",height:"50px",borderRadius:"10px",marginBottom:"300px",marginLeft:"70px"}}>premiun</button>
          </div>
          <div class="card-body">
            
          </div>
        </div>
        <div class="col-sm-4" style={{paddingRight:"250px",alignItems:"center",borerRadius:"20px"}}>
          <div class="card" style={{  backgroundImage: "linear-gradient(to right , #d3af37,#ffff",width:"300px",height:"400px",borerRadius:"20px",boxShadow:"0 0 5px 5px"}}>
            
            <img src="./deluxe-gold-label-vector-2274967.jpg" alt="icon" style={{marginLeft:"90px",marginTop:"15px"}}/>
            <h3 style={{paddingLeft:"50px",paddingBottom:"5px",paddingTop:"10px"}}>Just for 1000/-</h3>
            <ui style={{marginBottom:"30px",marginTop:"10px",paddingLeft:"20px"}} >
              <li style={{listStyle:"inherit"}}>Ad free</li>
              <li>Create multiple groups</li>
              <li>Create groups of any size</li>
              <li>Invite top users to your group</li>
              <li>Send requests to top users</li>
            </ui>
          <button type="button" class="btn btn-outline-primary" style={{color:"white",backgroundColor:"#3d300c",width:"140px",height:"40px",borderRadius:"10px",marginTop:"0px",marginLeft:"80px",justifyContent:"center"}}>deluxe</button>
          </div>
          <div class="card-body">
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
