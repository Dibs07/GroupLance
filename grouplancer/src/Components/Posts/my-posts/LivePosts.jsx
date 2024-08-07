import React, { useState,useEffect } from 'react';
import Livepost from './Livepost';


function Liveposts() {
    const groupImage = "/creategrp.jpg";
    const color = "#dfdffb";
    const [posts, setPosts] = useState();
    
    useEffect(() => {
    const fetchPost = async () => {
      try {
        const authToken = localStorage.getItem("auth-token");
        const response = await fetch(
          `http://localhost:8080/api/tweet/get-all-posts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": authToken,
            },
          }
        );
        const data = await response.json();
        setPosts(data.posts);
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPost()
  }
    , [])

  return (
    <>
      {/* <h1 className='text-center my-4' style={{ color: '#ffff', fontWeight: "bold" }}>Live Posts</h1> */}
      <div className="container">
        <div className="container row" style={{ flexDirection: "column" , display:"flex",}}>
        {
            posts && posts?.map(({ groupId, content, _id, file }) => {
              return (
                <div class="col-md-3 mb-3" style={{ width: "100%", height: "100%" }} >
                  <Livepost groupName={groupId.gName} postdesc={content} groupImage={groupImage} color={color} tweetId={_id} groupId={groupId._id} image={file?.image} />
                </div>
              )
            })
          }
        </div>
      </div>
      {/* <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Post groupName={title} postDescription={description} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog> */}
    </>
  );
}

export default Liveposts;
