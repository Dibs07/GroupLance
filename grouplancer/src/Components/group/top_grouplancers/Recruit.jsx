import { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Checkbox from '@mui/material/Checkbox';
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import StarIcon from '@mui/icons-material/Star';
import toast from "react-hot-toast";

const Recruit = ({ id, name, email, rate, profilePic, color, groups, skills }) => {
  // console.log(groups)
  const [myGroups, setMyGroups] = useState([]);
  const navigate = useNavigate()
  const { currentUser } = useUser();
  const [profileopen, setprofileOpen] = useState(false)
  const [memberId, setMemberId] = useState("")
  const [invitedGroup, setInvitedGroup] = useState("")

  const handleProfileClose = () => setprofileOpen(false)
  const handleProfileOpen = () => setprofileOpen(true)

  const inviteMember = async (id, gDesc,gName) => {
    try {
      const authToken = localStorage.getItem("auth-token");
      const response = await fetch(
        "http://localhost:8080/api/group/invite-members",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({
            invitedUserMail: email,
            invitationLink: "http://localhost:3000/notify",
            group: {
              id: id,
              name: gName,
              desc: gDesc,
            },
            inviterName: currentUser.name,
          }),
        }
      );
      const data = await response.json();

      console.log(data)
      toast.success("Invitation Sent")
    } catch (error) {
      console.error(error);
      toast.error("Error !")
    }
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);


  const handleClose = () => setOpen(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleToggle = (groupName) => () => {
    setSelectedGroup(groupName === selectedGroup ? null : groupName);
  };


  useEffect(() => {
    // if (currentUser)
    //     navigate("/login")
    // else {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('auth-token');
        const response = await fetch("http://localhost:8080/api/user/owned-groups", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
        });
        const data = await response.json();
        console.log(data.ownedGroups);
        setMyGroups(data.ownedGroups);

      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }
    //}
    , [currentUser, navigate])
  return (
    <>
      {/* <div className="card" style={{ backgroundColor: color, width: "50vw" }}>
                <div className="card-body" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundImage: "linear-gradient( #6666ff, #1a1aff)", backdropFilter: "blur(50px)", boxShadow: "10px 5px 5px #a6a6a6", border: "4px solid white", borderRadius: "4px" }}>
                    <img
                        src={profilePic ? profilePic : "https://cdn-icons-png.flaticon.com/256/4021/4021443.png"}
                        alt="Profile Picture"
                        style={{ width: "8vw", height: "18vh", margin: " 3rem 7rem 0.2rem 7rem", bottom: "5px", cursor: "pointer" }}
                    />
                    <h5 style={{ marginLeft: "2px", color: "white", fontWeight: "700px" }} className="card-title">{name}</h5>
                    <p style={{ color: "white", fontWeight: "700px" }} className="card-text">{email}</p>
                    <Button style={{ backgroundColor: "#000066",color:"white",width:"10vw",height:"5vh"}} variant="contained" endIcon={<SendIcon />}>
                        Invite
                    </Button>
                </div>
            </div>  */}
      <Card style={{ width: '50vw', display: "flex", flexDirection: "row", borderRadius: "1rem", margin: "0rem 15rem 0rem 15rem", padding: "1rem", backgroundColor: "beige" }}>
        <Card.Img variant="top" src={profilePic ? profilePic : "https://cdn-icons-png.flaticon.com/256/4021/4021443.png"}
          alt="Profile Picture"
          style={{ width: "8vw", height: "18vh", margin: " 0.9rem 7rem 0.2rem 7rem", cursor: "pointer", borderRadius: "1rem", boxShadow: "5px 2px 8px 2px #151e3d" }} />
        <div>

          <ListGroup className="list-group-flush" style={{ borderRadius: "0.5rem", boxShadow: "5px 2px 3px 2px #59788e" }}>
            <ListGroup.Item>Name:  {name}</ListGroup.Item>
            <ListGroup.Item style={{display:"flex"}}>Rate: {rate} {rate != null ? <StarIcon style={{ color: "#ffde38" }} /> : <p> Not Rated</p>}</ListGroup.Item>
          </ListGroup>
          <Card.Body style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            {currentUser._id !== id ?
              <Button onClick={handleOpen} style={{ backgroundColor: "#000066", color: "white", width: "10vw", height: "5vh", display: "block", margin: "0 auto" }} variant="contained" endIcon={<SendIcon />} >
                Invite
              </Button> : null}

            <button type="button" class="btn btn-primary" onClick={handleProfileOpen} style={{ backgroundColor: "#000066", color: "white", width: "10vw", height: "5vh", display: "block", margin: "0 auto" }}>
              View Profile
            </button>

          </Card.Body>
        </div>

      </Card>
      {/* <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-2" aria-labelledby="staticBackdropLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="staticBackdropLabel">Profile Information:</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
               
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Understood</button>
                  </div>
                </div>
              </div>
            </div> */}

      <Modal
        open={profileopen}
        onClose={handleProfileClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"

      >
        <Box sx={style} style={{}}>
          <Typography id="modal-modal-title" variant="h4" component="h2">

          </Typography>
          <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
            <span>Name:</span> {name}
          </Typography>
          <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
            <span>Email:</span> {email}
          </Typography>
          <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
            <span>Skills:</span>
          </Typography>

          {skills.length ? skills.map((skill) => {
            return (
              <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }} style={{ backgroundColor: "#1F456C", padding: "1rem", borderRadius: "1rem" }}>
                {skill}
              </Typography>
            )

          }) :
            <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
              No skills
            </Typography>}
          {/* 
            
             <Typography id="modal-modal-description" variant="h6" sx={{ mt: 2 }}>
              <span style={{textDecoration:"underline"}}>Group Description</span> : {description}
            </Typography> */}
          <Button variant="contained" onClick={handleProfileClose} style={{ marginTop: "2rem", backgroundColor: "#05023b", color: "white" }}>
            Close
          </Button>
        </Box>

      </Modal>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <List dense sx={{ width: '100%', maxWidth: 360 }}>
            {Object.keys(myGroups).length ?
              <Typography id="modal-modal-title" variant="h4" component="h2" style={{ display: "flex", justifyContent: "center" }}>
                Invite
              </Typography> :
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ display: "flex", justifyContent: "center" }}>
                You don't have any group
              </Typography>
            }

            {myGroups &&
              myGroups.map(({ gName, _id, gDesc }) => {
                const labelId = `checkbox-list-secondary-label-${gName}`
                return (
                  <>
                    <div style={{ display: "flex" }}>
                      <ListItem style={{ display: "flex", flexDirection: "row", marginRight: "2px", paddingRight: "2px" }}
                        key={gName}
                      >

                        <Typography variant="body1" style={{ fontSize: '1.2rem', marginTop: "1rem", marginRight: "3px", paddingRight: "2px" }}>
                          {gName}
                        </Typography>

                      </ListItem>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleClose();
                          inviteMember(_id, gDesc,gName)
                        }}
                        style={{ marginTop: '2rem', backgroundColor: '#05023b', color: '#ffff' }}
                      >
                        Invite
                      </Button>
                    </div>
                  </>
                );
              })}
          </List>
        </Box>
      </Modal>
    </>
  )
}
const style = {
  overflowWrap: "break-word",
  position: 'absolute',
  color: "white",
  borderRadius: "1rem",
  border: "2px solid white",
  top: '50%',
  left: '50%',
  // minWidth: '800px',
  transform: 'translate(-50%, -50%)',
  width: "500px",
  backgroundImage: "linear-gradient(#3048c3,#0492c2)",
  boxShadow: 24,
  p: 4,
};
export default Recruit