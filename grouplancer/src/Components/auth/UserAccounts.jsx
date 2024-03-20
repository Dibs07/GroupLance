import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Modal,
  TextField,
  Fab,
  Autocomplete,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

import { names } from "../constant/skills";

const UserAccounts = () => {
  const { currentUser, logout } = useUser();
  const [userData, setUserData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [skillopen, setskillOpen] = useState(false);
  const [eduopen, seteduOpen] = useState(false);
  const [workopen, setworkOpen] = useState(false);
  const [WorkExp, setWorkExp] = useState("");
  const [WorkExpList, setWorkExpList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [institutionName, setInstitutionName] = useState("");
  const [duration, setDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [educationList, setEducationList] = useState([]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSkillOpen = () => setskillOpen(true);
  const handleSkillClose = () => setskillOpen(false);
  const handleeduOpen = () => seteduOpen(true);
  const handleeduClose = () => seteduOpen(false);
  const handleworkOpen = () => setworkOpen(true);
  const handleworkClose = () => setworkOpen(false);
  const handleAddWorkExp = () => {
    if (WorkExp.trim() !== "") {
      setWorkExpList([...WorkExpList, WorkExp]);
      setWorkExp("");
    }
  };

  const handleAddEducation = () => {
    const newEducation = {
      institutionName,
      duration,
      startDate,
      endDate
    };
    setEducationList([...educationList, newEducation]);
    setInstitutionName("");
    setDuration("");
    setStartDate("");
    setEndDate("");
    handleeduClose();
  };

  const updateUser = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch(`http://localhost:8080/api/user/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('auth-token'),
        },
        body: JSON.stringify({ education: educationList, workExp: WorkExpList, skills: skillsList }),
      });
      const json = await response.json();
      console.log(json);
      navigate("/userAccount");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        const response = await fetch(
          `http://localhost:8080/api/user/get-user-account`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
          }
        );
        const data = await response.json();
        setUserData(data.user);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [currentUser, navigate]);

  return (
    <>
      <Typography variant="h2" component="div" className="text-center" color="white">
        Your Profile
      </Typography>
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh" marginTop="0.5vh" >
        <Box display="flex" flexDirection="row" gap={2}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Card sx={{ width: "40vw", height: "30vh", borderRadius: "1rem" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  UserName
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.name}
                </Typography>
                <Typography variant="h5" component="div" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userData.email}
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={handleOpen} style={{ margin: "auto" }} startIcon={<EditIcon />}>Edit</Button>
              </CardActions>
              <Modal open={open} onClose={handleClose}>
                <Box sx={{ ...style, width: 400 }}>
                  <TextField label="Name" fullWidth />
                  <Button onClick={handleClose} style={{ margin: "auto" }}>Submit</Button>
                </Box>

              </Modal>
            </Card>
            <Card sx={{ width: "40vw", height: "30vh", borderRadius: "1rem" }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Personal Ranking
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  userdata.ranking
                </Typography>
                <Typography variant="h5" component="div" gutterBottom>
                  Group Rankings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Highest Group Rank
                </Typography>
              </CardContent>
              <CardActions>
                <Button style={{ margin: "auto" }}>Check All Rankings</Button>
              </CardActions>

            </Card>
          </Box>
          <Card sx={{ width: "40vw", borderRadius: "1rem" }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                User Details
              </Typography>
              <List>

                <ListItem>
                  <ListItemText primary="Skills:" />
                  <Button variant="contained" onClick={handleSkillOpen}>
                    Add <AddIcon />
                  </Button>
                  <Modal open={skillopen} onClose={handleSkillClose}>
                    <Box sx={{ ...style, width: 400 }}>
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={names.sort()}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField {...params} label="Skills" placeholder="Add" />
                        )}
                      />
                      <Button onClick={handleSkillClose} style={{ margin: "auto" }}>Submit</Button>
                    </Box>

                  </Modal>
                  <List>
                    {skillsList.map((skill, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Education:" />
                  <Button variant="contained" onClick={handleeduOpen}>
                    Add <AddIcon />
                  </Button>
                  <Modal open={eduopen} onClose={handleeduClose}>
                    <Box sx={style}>
                      <TextField
                        label="Institution Name"
                        fullWidth
                        required
                        value={institutionName}
                        onChange={(e) => setInstitutionName(e.target.value)}
                        style={{ marginBottom: "2vh" }}
                      />
                      <TextField
                        label="Duration"
                        fullWidth
                        required
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        style={{ marginBottom: "2vh" }}
                      />
                      <TextField
                        label="Start Date"
                        fullWidth
                        required
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ marginBottom: "2vh" }}
                      />
                      <TextField
                        label="End Date"
                        fullWidth
                        required
                        type="date"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                      <Button onClick={handleAddEducation} style={{ marginTop: "1rem" }}>Submit</Button>
                    </Box>
                  </Modal>

                  <List>
                    {educationList.map((edu, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={edu.institutionName} />
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Work Experience:" />
                  <Button variant="contained" onClick={handleworkOpen}>
                    Add <AddIcon />
                  </Button>
                  <Modal open={workopen} onClose={handleworkClose}>
                    <Box sx={{ ...style, width: 400 }}>
                      <TextField label="Name" fullWidth />
                      <Button onClick={handleworkClose} style={{ margin: "auto" }}>Submit</Button>
                    </Box>

                  </Modal>
                  <List>
                    {WorkExpList.map((work, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={work} />
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
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
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default UserAccounts;
