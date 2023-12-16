import React, { useState } from "react";


const CreateGroup = () => {
  const [data, setData] = useState(2);
  
  
 
  return (
    <>
      <h1 className='text-center my-4' style={{ color: '#ffff' }}>Create Group</h1>
      <div className="container mt-3" style={{ width: "800px", color: "white" }}>
        <form>
          <div className="mb-3">
            <label htmlFor="gname" className="form-label">
              Group Name
            </label>
            <input
              type="text"
              className="form-control"
              id="gname"
              aria-describedby="emailHelp"
              required
            />
            <hr />
            <label htmlFor="pname" className="form-label">
              Project Name
            </label>
            <input
              type="text"
              className="form-control"
              id="pname"
              aria-describedby="emailHelp"
              required
            />
            <br />
            <label htmlFor="text" className="form-label">
              Main Goal
            </label>
            <input
              type="text"
              className="form-control"
              id="text"
              aria-describedby="emailHelp"
            />
          </div>
          <div className="input-group mb-3">
           <label>
            Select Domain
         
            <select  style={{ width:"779px", height:"40px", borderRadius:"7px"}} onChange={(e) => setData(e.target.value)}>
              <option> </option>
              <option >General</option>
              <option >Web Developement</option>
              <option >App Developement</option>
              <option >CyberSecurity</option>
              <option >IOT</option>
            </select>
            </label> 
            
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Group Description
              <textarea
                className="form-control"
                id="description"
                cols="173"
                rows="5"
              ></textarea>
            </label>
            <label htmlFor="text" className="form-label">
              Group Members
            </label>
            <input type="range" className="form-range" min="2" max="6" id="customRange2"value={data} onChange={(e) => setData(e.target.value)} />
            <h1 style={{ color: "white" }}>{data}</h1>
            <p><span id="demo"></span></p>
          </div>
          <br />
          <div className="input-group mb-3">
          <label> Group Type
           <select  style={{ width:"779px", height:"40px", borderRadius:"7px"}}  onChange={(e) => setData(e.target.value)}>
              <option> </option>
              <option >Public</option>
              <option >Private</option>
            </select>
            </label> 
          </div>
          <div className="input-group mb-3">
          <label> Who can join
           <select style={{ width:"779px", height:"40px", borderRadius:"7px"}} onChange={(e) => setData(e.target.value)}>
              <option> </option>
              <option>Anyone can join</option>
              <option>Join with invite</option>
            </select>
            </label> 
          </div>
          <button type="submit" className="btn btn-primary">
            Create Group
          </button>
        </form>
      </div>
      {/* <script>
        const slider = document.getElementById("customRange2");
        const output = document.getElementById("demo");
        output.innerHTML = slider.value;

        slider.oninput = function () {
          output.innerHTML = this.value
      }
      </script> */}
    </>
  );
};

export default CreateGroup;
