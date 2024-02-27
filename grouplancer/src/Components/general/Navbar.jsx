// import React, { useState, useEffect } from 'react'
// import { Link } from 'react-router-dom'
// import { useUser } from "../../context/UserContext";
// import { Navbar, Nav, Container } from "react-bootstrap";
// import { HashLink } from 'react-router-hash-link';
// import {
//     BrowserRouter as Router
// } from "react-router-dom";

// const NavBar = () => {
//     const { currentUser } = useUser();
//     const [activeLink, setActiveLink] = useState('home');
//     const [scrolled, setScrolled] = useState(false);

//     useEffect(() => {
//         const onScroll = () => {
//             if (window.scrollY > 50) {
//                 setScrolled(true);
//             } else {
//                 setScrolled(false);
//             }
//         }

//         window.addEventListener("scroll", onScroll);

//         return () => window.removeEventListener("scroll", onScroll);
//     }, [])

//     const onUpdateActiveLink = (value) => {
//         setActiveLink(value);
//     }

//     return (
//         <>


//             <Router>
//                 <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
//                     <Container>
//                         <Navbar.Brand href="/">
//                             <img src="./grouplan.png" alt="Logo" style={{ width: "300px", height: "200px", justifyContent: "space-between", marginBottom: "-50px", marginTop: "-50px" }} />
//                         </Navbar.Brand>
//                         <Navbar.Toggle aria-controls="basic-navbar-nav">
//                             <span className="navbar-toggler-icon"></span>
//                         </Navbar.Toggle>
//                         <Navbar.Collapse id="basic-navbar-nav">
//                             <Nav className="ms-auto">
//                                 <Link to="/" className={activeLink === 'home' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('home')}>Home</Link>
//                                 <Link to="sidebar" className={activeLink === 'groups' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('groups')}>Groups</Link>
//                                 <Link to="liveside" className={activeLink === 'categories' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('categories')}>Categories</Link>
//                                 <Link to="sidebar_ranking" className={activeLink === 'rankings' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('rankings')}>Rankings</Link>
//                                 <Link to="chatbox" className={activeLink === 'chatbox' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('chatbox')}>ChatBox</Link>
//                                 <Link to="aboutus" className={activeLink === 'about' ? 'active navbar-link' : 'navbar-link'} onClick={() => onUpdateActiveLink('about')}>About Us</Link>
//                             </Nav>
//                             <span className="navbar-text">
//                                 <div className="social-icon">
//                                     <a href="#"><img src={navIcon1} alt="" /></a>
//                                     <a href="#"><img src={navIcon2} alt="" /></a>
//                                     <a href="#"><img src={navIcon3} alt="" /></a>
//                                 </div>
//                                 {
//                                     currentUser ?

//                                             <Nav.Link className="profile" href="userAccount"><button className="vvd"><span>Profile</span></button></Nav.Link>
//                                              : <HashLink to='#connect'>
//                                             <button className="vvd"><span>Sign Up/Sign In</span></button>
//                                         </HashLink>
//                                 }
//                             </span>
//                         </Navbar.Collapse>
//                     </Container>
//                 </Navbar>
//             </Router>


//         </>
//     )
// }

// export default NavBar
import React, { useState, useEffect } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { HashLink } from "react-router-hash-link";
import { BrowserRouter as Router } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const NavBar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { currentUser, logout } = useUser();


    const handleLogout = async () => {
        const authToken = localStorage.getItem("auth-token");
        await fetch("http://localhost:8080/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": authToken,
            },
        });
        logout();
        localStorage.setItem("auth-token", "");
        localStorage.setItem("refresh-token", "");
    };

    const deactivateUser = async (e) => {
        e.preventDefault();
        const response = await fetch(
            "http://localhost:8080/api/auth/deactivate-user",
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                },
            }
        );
        const json = await response.json();
        console.log(json);
        logout();
    };

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static" style={{ backgroundColor: "#253aa1", background: "transparent" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <img src="./grouplan.png" alt="Logo" style={{ width: "300px", height: "200px", justifyContent: "space-between", marginBottom: "-50px", marginTop: "-50px", marginLeft: "0px" }} />

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/" style={{ color: "black", textDecoration: "none" }}>Home</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link to="/sidebar" style={{ color: "black", textDecoration: "none" }}>Groups</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/liveside" style={{ color: "black", textDecoration: "none" }}>Categories</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/sidebar_ranking" style={{ color: "black", textDecoration: "none" }}>Rankings</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/chatbox" style={{ color: "black", textDecoration: "none" }}>ChatBox</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/aboutus" style={{ color: "black", textDecoration: "none" }}>About Us</Link>
                                </Typography>
                            </MenuItem>
                            <MenuItem onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">
                                    <Link href="/postbar" style={{ color: "black", textDecoration: "none" }}>Posts</Link>
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/sidebar" style={{ color: "white", textDecoration: "none" }}>Groups</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/liveside" style={{ color: "white", textDecoration: "none" }}>Categories</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/sidebar_ranking" style={{ color: "white", textDecoration: "none" }}>Rankings</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/chatbox" style={{ color: "white", textDecoration: "none" }}>ChatBox</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/aboutus" style={{ color: "white", textDecoration: "none" }}>About Us</Link>
                        </Button>
                        <Button
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            <Link href="/postbar" style={{ color: "white", textDecoration: "none" }}>Posts</Link>
                        </Button>
                    </Box>
                    {
                        currentUser ?
                            <Box sx={{ flexGrow: 0 }}>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <img alt="Remy Sharp" src="./default-user.jpg" style={{ height: "10vh", width: "10vh" }} />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: '45px' }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center"><Button href="/userAccount" style={{ color: "black", textDecoration: "none" }}>Profile</Button></Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center"><Button href="/" style={{ color: "black", textDecoration: "none" }} onClick={handleLogout}>Logout</Button></Typography>
                                    </MenuItem>
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center"><Button href="/" style={{ color: "black", textDecoration: "none" }} onClick={deactivateUser}>Delete User</Button></Typography>
                                    </MenuItem>

                                </Menu>
                            </Box>: 
                            <Button style={{borderRadius: "10px", backgroundColor: "white", height: "8vh", width: "20vh", color: "black"}}>Sign Up/Sign In</Button>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;