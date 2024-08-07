import React from "react";
import {useUser} from "../../../context/UserContext";
import toast from "react-hot-toast";


const GroupInvite = ({ color, title, description, id, canJoin }) => {
  const {currentUser}=useUser();
  console.log(currentUser);
  const liveGroup = async (e) => {
    e.preventDefault(); 
    const response = await fetch("http://localhost:8080/api/group/join-group", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ groupId: id }),
    });
    const json = await response.json();
    console.log(json);
    toast.success("Group joined successfully")
  };
  return (
    <>
      <div className="card" style={{ backgroundColor: color }}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <div style={{ display: "flex"}}>
            <button className="button-48" style={{ width: "15vh",margin: 0,display:"flex",justifyContent:"center", alignItems:"center" }}>
              <span>
                <a
                  href="/"
                  onClick={liveGroup}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Accept
                </a>
              </span>
            </button>
            <button
              className="button-48"
              style={{ width: "15vh", marginLeft: "1rem",display:"flex",justifyContent:"center", alignItems:"center" }}
            >
              <span style={{ margin: "0px" }}>
                <a
                  href="/"
                  onClick={liveGroup}
                  style={{
                    textDecoration: "none",
                    color: "white",
                    fontWeight: "700",
                  }}
                >
                  Reject
                </a>
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupInvite;
