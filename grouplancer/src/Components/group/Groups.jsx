import React, { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import EditGroup from "./EditGroup";
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Rating from '@mui/material/Rating';
import { Timestamp, addDoc, collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Groups = ({ grpName, grpLeader, projName, grpDesc, gMembers, groupId, goal, domains, rate }) => {
  const [credentials, setCredentials] = useState({ email: "" });
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { id } = useParams();


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const [ratings, setRatings] = useState({});


  const handleRating = (userId, ratingValue) => {
    setRatings(prevRatings => ({
      ...prevRatings,
      [userId]: ratingValue
    }));
  };
  const ratingUser = async (e,val, _id) => {
    e.preventDefault();
    console.log(val)
    const response = await fetch("http://localhost:8080/api/user/rate-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ rate: val === 0 ? 1 : val, userId: _id }),
    });
    const json = await response.json();
    console.log(json)
  }

  const ratingValue = async (e,val, _id) => {
    e.preventDefault();
    console.log(val)
    const response = await fetch("http://localhost:8080/api/rate/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ rating: val === 0 ? 1 : val, ratedUser: _id }),
    });
    const json = await response.json();
    console.log(json)
  }

  const getRatedUser = async (e, _id) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:8080/api/rate/ratings/${_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
      },
    });
    const json = await response.json();
    console.log(json)
  }

  const inviteMember = async () => {
    try {
      const authToken = localStorage.getItem("auth-token");
      const response = await fetch(
        `http://localhost:8080/api/group/invite-members`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": authToken,
          },
          body: JSON.stringify({
            invitedUserMail: credentials.email,
            invitationLink: "http://localhost:3000/notify",
            group: {
              id: id,
              name: grpName,
              desc: grpDesc,
            },
            inviterName: currentUser.name,
          }),
        }
      );
      const data = await response.json();
      console.log(data)
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGroup = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/group/delete-group", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ groupId: groupId }),
    });
    const json = await response.json();
    console.log(json)
    navigate("/")
  }

  const removeMember = async (id) => {
    const response = await fetch("http://localhost:8080/api/group/remove-member", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('auth-token'),
      },
      body: JSON.stringify({ userId: id, groupId: groupId }),
    });
    const json = await response.json();
    console.log(json)
    navigate("/")
  }

  const onchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleCloseDel = () => setOpen(false);

  const [project, setProject] = useState({
    projectname: "",
    projectdesc: "",
    groupid: groupId,
    Leader: currentUser._id,
    assigned: "",
    time: Timestamp.now(),
    date: new Date().toLocaleString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    )
  });

  const addProjectFunction = async () => {
    if (project.projectname === "" || project.projectdesc === "") {
      return toast.error("all fields are required")
    }
    //console.log(project);
    try {
      const projectRef = collection(fireDB, 'projects');
      await addDoc(projectRef, project)
      toast.success("Project Added successfully");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("Add project failed");
    }
  }
  const [getAllProject, setGetAllProject] = useState([]);
  useEffect(() => {
    const getAllProjectFunction = async () => {
      try {
        const q = query(
          collection(fireDB, "projects"),
          orderBy("time"),
        );
        const data = onSnapshot(q, (QuerySnapshot) => {
          let projectArray = [];
          QuerySnapshot.forEach((doc) => {
            projectArray.push({ ...doc.data(), id: doc.id });
          });
          // setGetAllProject(projectArray);
          console.log(projectArray);
          const filteredProjects = projectArray.filter(
            (project) => project.groupid === groupId
          );
          setGetAllProject(filteredProjects);
        });
        return () => data;
      } catch (error) {
        console.log(error);
      }
    };
    getAllProjectFunction();
  }, [groupId]);

  


  return (
    <>
    
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center", padding: "2rem"
        }}
      >
        <h1 className="text-center my-4" style={{ color: "#ffff", margin: "auto" }}>
          {grpName}
        </h1>
        {(grpLeader === currentUser?._id) && (<>
          <button
            className="button-48"
            type="submit"
            style={{
              color: "white",
              padding: "10px",
              marginRight: "1rem",
              backgroundColor: "#cc0000",
            }}
            onClick={handleOpen}
          >
            <span> Delete Group</span>
          </button>
        <Modal show={open} onClose={handleCloseDel}>
          <Box marginTop="40vh" sx={{ ...style }}>
            <Typography variant="h6" gutterBottom>
              Are you sure you want to delete your group?
            </Typography>
            <Button href="/" variant="contained" color='error' onClick={deleteGroup} style={{ marginRight: '10px' }}>
              Yes, delete
            </Button>
            <Button variant="contained" onClick={handleCloseDel}>
              Cancel
            </Button>
          </Box>
        </Modal>
        </> )}
        {(grpLeader !== currentUser?._id) && (
          <button
            className="button-48"
            type="submit"
            onClick={() => removeMember(currentUser._id)}
            style={{
              color: "white",
              marginRight: "1rem",
              backgroundColor: "#cc0000", borderRadius: "1.2rem",
              padding: "1rem 2rem 1rem 2rem",
            }}
          >
            <span>Leave Group</span>
          </button>
        )}
      </div>

      <div className="container my-4" display="flex" alignItems="center">
        <div
          style={{
            marginTop: "30px",
            backgroundColor: "white",
            width: "180vh",
            textAlign: "justify",
            borderRadius: "15px",
            paddingLeft: "20px",
            paddingTop: "10px", paddingBottom: "1rem",
            boxShadow: "0 0 10px 5px",
          }}
        >
          <p style={{ fontSize: "25px", padding: "10px" }}>Name: {projName} </p>
          <p style={{ fontSize: "25px", padding: "10px" }}>Description: {grpDesc}</p>
          <p style={{ fontSize: "25px", padding: "10px" }}>Goal: {goal}</p>
          <p style={{ fontSize: "25px", padding: "10px" }}>Domains: {domains}</p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {(grpLeader === currentUser?._id) && (<button
              type="submit"
              className="button-48"
              style={{ marginBottom: "3vh", display: "block", margin: "1rem" }}
              onClick={handleOpenModal}

            >
              <span> Edit details</span>
            </button>)}

            {(grpLeader === currentUser?._id) && (
              <Button variant="primary" className="button-48" onClick={handleShow} style={{ display: "block", color: "white", padding: "1rem 2rem 1rem 2rem", backgroundColor: "#151e3d", borderRadius: "1.5rem" }}>
                <span>Create Task</span>
              </Button>
            )}
          </div>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Enter Task Details </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form >
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                  <Form.Label>Task Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Task Name"
                    autoFocus
                    required
                    onChange={(e) => setProject({ ...project, projectname: e.target.value })}
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlTextarea1"
                >
                  <Form.Label>Task Description</Form.Label>
                  <Form.Control as="textarea" rows={3} required onChange={(e) => setProject({ ...project, projectdesc: e.target.value })} />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary" onClick={addProjectFunction}>
                Create
              </Button>
            </Modal.Footer>
          </Modal>

        </div>
      </div>


      <div style={{ alignItems: "center" }}>
        <h1
          style={{
            color: "#ffff",
            marginTop: "2rem",
            marginBottom: "2rem",
            marginLeft: "48rem",
          }}
        >
          {" "}
          Members
        </h1>
      </div>


      <div style={{ display: "flex", gap: "0.5rem" }}>

        <div class="col-sm-4">

          {(grpLeader === currentUser?._id) && (<div
            class="card"
            style={{
              marginTop: "1%",
              flexDirection: "column",
              boxShadow: "0 0 10px 5px",
              borderRadius: "20px",
              display: "flex",
              width: "25vw",
              height: "20vh",
              margin: "0rem 2rem 10rem 1rem",
            }}
          >
            <h2 style={{ fontweight: "bold", color: "black", padding: "0.5rem 2rem 0.5rem 2rem" }}>Add members</h2>
            <div
              class="card-body"
              style={{ backgroundColor: "white", borderRadius: "20px" }}
            >
              <img src="https://tse4.mm.bing.net/th?id=OIP.JCwjYrZogNHv50VtbileUgHaEK&pid=Api&P=0&h=180" alt="logo" style={{ width: "22vw", height: "150px", borderRadius: "20px", margin: "1px 5px 1px 1px" }}></img>
              <h4 className="text-center my-4">Invite a member</h4>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  onChange={onchange}
                  name="email"
                  required
                />
              </div>
              <button style={{ transform: "translateX(70%)" }} className="btn btn-primary" onSubmit={inviteMember}>
                Send Invitation
              </button>

            </div>

          </div>)}
          {(grpLeader !== currentUser?._id) && (
            <div style={{ backgroundColor: "white", borderRadius: "1rem", padding: "1rem" }}>
              {/* 
              <img style={{ width: "25vw", height: "50vh", margin: "0rem 2rem 2rem 1rem", borderRadius: "0rem 0rem 2rem 2rem" }} src="https://imind.com/wp-content/uploads/2023/01/18.jpg" alt="filler"></img> */}

              <img style={{ width: "25vw", height: "50vh", margin: "0rem 2rem 0rem 1rem", borderRadius: "2rem 2rem 0rem 0rem" }} src="https://assets-global.website-files.com/5b69a01ba2e409501de055d1/654397e57d1b4f0a5d9c1bc0_Social%20loafing.png" alt="filler"></img>
              <h3 style={{ alignItems: "center" }}>Assigned Duties</h3>
              <ListGroup as="ul">
                <ListGroup.Item as="li" active>
                  Current Duty
                </ListGroup.Item>
                {getAllProject.map((project) => (
                  <>
                    {project.assigned === currentUser._id ? <ListGroup.Item as="li">{project.projectname}</ListGroup.Item> : null}

                  </>
                ))}
              </ListGroup>

            </div>)}

        </div>

        <div style={{ display: "flex", gap: "5rem", background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(5px)", borderRadius: "20px" }}>
          <div className="container my-4" display="flex" alignItems="center">
            <div className="row">
              {gMembers?.map(({ _id, name, email }) => (
                <div className="col-sm-6" key={_id} style={{ padding: "50px" }}>
                  <div
                    className="card"
                    style={{
                      marginTop: "5%",
                      flexDirection: "column",
                      boxShadow: "0 0 10px 5px",
                      borderRadius: "50px",
                      display: "flex",
                      width: "300px",
                      height: "250px",
                    }}
                  >
                    <div
                      className="card-body"
                      style={{ backgroundColor: "white", borderRadius: "20px" }}
                    >
                      {/* <img
                        style={{
                          height: "100px",
                          width: "200px",
                          paddingLeft: "100px",
                          paddingRight: "20px",
                        }}
                        // src={member.profileImageUrl}
                        alt="profile"
                        className="imaging"
                      /> */}
                      <h5 className="card-title">Name: {name}</h5>
                      <p className="card-text">Email: {email}</p>
                      {(_id !== currentUser?._id) && (<div style={{ display: "flex", marginRight: "1rem" }}>
                        <Rating
                          name={`rating-${_id}`} // Unique name for each Rating component
                          value={ratings[_id] || 0} 
                          onChange={(e, value) => {
                            handleRating(_id, value);
                            ratingUser(e,value, _id);
                            ratingValue(e,value, _id);
                            getRatedUser(e, _id);
                          }}
                        />
                      </div>)}
                      {/* {(grpLeader === currentUser?._id && _id !== currentUser?._id) && (
                        <div style={{ margin: "0.5rem" }}>  <label>Assign a duty</label>
                          <input style={{ borderRadius: "1rem", padding: "0.5rem" }} placeholder="complete task1"></input></div>
                      )} */}
                      {(grpLeader === currentUser?._id && _id !== currentUser?._id) && (<button
                        type="submit"
                        className="btn btn-primary"
                        onClick={() => removeMember(_id)}
                        style={{ marginTop: "3vh" }}
                      >
                        Remove
                      </button>)}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <Dialog open={isModalOpen} onClose={handleCloseModal} >
        <DialogTitle>{projName}</DialogTitle>
        <DialogContent>
          <EditGroup />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
const style = {
  position: "absolute",
  gap: 2,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "4px solid #000",
  boxShadow: 24,
  p: 4,
};

export default Groups;
