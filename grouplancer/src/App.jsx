import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Header from './Components/general/Header';
import NavBar from './Components/general/Navbar';
import Footer from './Components/general/footer/Footer';
import Login from './Components/auth/login/Login';
import Signup from './Components/auth/signup/Signup';
import UserAccounts from './Components/auth/user-accounts/UserAccounts';
import UserAccountbusiness from './Components/auth/user-accounts/UserAccountbusiness';
import Home from './Components/features/Home';
import AboutUs from './Components/features/AboutUs';
import Groups from './Components/group/Groups';
import CreateGroup from './Components/group/CreateGroup';
import MyGroups from './Components/group/my_groups/Mygroups';
import JoinedGroups from './Components/group/joined_groups/JoinedGroups';
import LiveGroups from './Components/group/live_groups/LiveGroups';
import TopGroups from './Components/group/top_groups/Topgroups';
import Recruits from './Components/group/top_grouplancers/Recruits';
import Jobs from './Components/Jobs';
import ChatBox from './Components/ChatBox/ChatBox';
import GroupsInvite from './Components/group/group_invite/groupsinvite';
import Sidebar from './Components/sidebar';
import Sidebar_ranking from './Components/sidebar_ranking';
import LiveSide from './Components/liveside';
import Post from './Components/Posts/Post';
import Postbar from './Components/Posts/PostBar';
import CreatePost1 from './Components/Posts/create-post/CreatePost1';
import Livepost from './Components/Posts/my-posts/Livepost';
import LivePosts from './Components/Posts/my-posts/LivePosts';
import Myposts from './Components/Posts/my-posts/Myposts';
import GroupTab from './Components/group/Group_Sidebar';
import EditGroup from './Components/group/EditGroup';
import Notification from './Components/notification/Notification';
import Logsign from './Components/auth/login/Logsign';
import { SocketProvider } from './context/SocketContext';
import SignUpBuis from './Components/auth/signup/SignUp_Buisness';
import CreateAccount from './Components/auth/CreateAccount';
import { Toaster } from 'react-hot-toast';
import VideoCall from './Components/VideoCall';

function App() {
  const bgcolor = "#0f054c";
  const accessTokenExpire = parseInt(5, 10);
  const time = accessTokenExpire * 60 * 1000;
  const { login } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const refreshToken = localStorage.getItem("refresh-token");
      const response = await fetch("http://localhost:8080/api/auth/refresh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "refresh-token": refreshToken
        },
      });
      const data = await response.json();
      localStorage.setItem('auth-token', data.acceessToken);
      localStorage.setItem('refresh-token', data.refreshToken);
      login(data.user);
    }
    fetchData();
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      try {
        const refreshToken = localStorage.getItem("refresh-token");
        const response = await fetch("http://localhost:8080/api/auth/refresh", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "refresh-token": refreshToken
          },
        });
        const data = await response.json();
        console.log(data);
        localStorage.setItem('auth-token', data.acceessToken);
        localStorage.setItem('refresh-token', data.refreshToken);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    }
    const intervalId = setInterval(() => {
      fetchData();
    }, time);
    return () => {
      clearInterval(intervalId);
    }
  });


  return (
    <div className='App'>

      <Router>

        <Routes>
          <Route exact path='/' element={<Home />} />
          <Route exact path='/aboutus' element={<AboutUs bgcolor={bgcolor} />} />
          <Route exact path='/login' element={<Login />} />
          <Route exact path='/signup' element={<Signup />} />
          <Route exact path='/livegroups' element={<LiveGroups />} />
          <Route exact path='/Mygroups' element={<MyGroups />} />
          <Route exact path='/creategroup' element={<CreateGroup />} />
          <Route exact path='/joinedgroups' element={<JoinedGroups />} />
          <Route exact path='/groupinvite' element={<GroupsInvite />} />
          <Route exact path='/findjob' element={<Jobs />} />
          <Route exact path='/recruit' element={<Recruits />} />
          <Route exact path='/topgroups' element={<TopGroups />} />
          <Route exact path='/chatbox' element={
            <SocketProvider>
              <ChatBox />
            </SocketProvider>
          } />
          <Route exact path='/sidebar' element={<Sidebar />} />
          <Route exact path='/userAccount' element={<UserAccounts />} />
          <Route exact path='/userAccountbusiness' element={<UserAccountbusiness />} />
          <Route exact path='/groups' element={<Groups />} />
          <Route exact path='/sidebar_ranking' element={<Sidebar_ranking />} />
          <Route exact path='/liveside' element={<LiveSide />} />
          <Route exact path="/posts" element={<Post />} />

          <Route exact path="/createposts1" element={<CreatePost1 />} />
          <Route exact path="/postbar" element={<Postbar />} />
          <Route exact path="/liveposts" element={<LivePosts />} />
          <Route exact path="/myposts" element={<Myposts />} />
          <Route exact path="/groupTab/:id" element={<GroupTab />} />
          <Route exact path="/editgrp" element={<EditGroup />} />
          <Route exact path="/notify" element={<Notification />} />
          <Route exact path="/logsig" element={<Logsign />} />
          <Route exact path="/signupbuis" element={<SignUpBuis />} />
          <Route exact path="/create" element={<CreateAccount />} />
          <Route exact path="/videoCall" element={<VideoCall />} />
        </Routes>
        <Toaster />
      </Router>
    </div>
  );
}

export default App;
