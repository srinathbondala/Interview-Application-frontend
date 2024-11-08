import React from 'react';
import useToken from '../useToken';
import { useNavigate } from 'react-router-dom';

function Navbar({logincallback,role}) {
  const navigate = useNavigate();
  const handleAddRoleClick = () => {
    console.log("Navigating to Add Role");
  };

  const { removeToken,checkToken } = useToken();
  function cleardata(){
    logincallback('');
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userType');
    localStorage.removeItem('Details');
    navigate('/');
    removeToken();
  }
  return (
    <>
    <div >
      <nav className="navbar py-3 bg-primary navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">INTERVIEW APPLICATION</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" ></span>
          </button>

          { role!==null?(
         <div className="collapse navbar-collapse" id="navbarNavDropdown">
           <ul className="navbar-nav ms-auto">
           {role==="user" || role==="admin" ?(
               <li className="nav-item"  >
                 <a className="nav-link" href=''onClick={cleardata} >LOGOUT</a>
               </li>):(<></>)}
               {role==="user" && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/user">USER</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/user/profile">PROFILE</a>
                  </li>
                </>)}
                {role==="admin" && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/admin">ADMIN</a>
                  </li>
                </>)}
           </ul>
        </div>
    ):
    (  <div className="collapse navbar-collapse" id="navbarNavDropdown">
      <ul className="navbar-nav ms-auto">
        <li className="nav-item">
          <button className="nav-link btn" 
                  data-bs-toggle="modal" 
                  data-bs-target="#aboutModal" 
                  style={{ backgroundColor: 'transparent', color: '#fff', transition: 'color 0.3s ease'}}
                  >         
            ABOUT
          </button>
        </li>
      </ul>
    </div>)}
          
        </div>
      </nav>

 
      <div className="modal fade" id="aboutModal" tabIndex="-1" aria-labelledby="aboutModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header" style={{ backgroundColor: '#2B3035', color: 'white' }}>
              <h5 className="modal-title" id="aboutModalLabel">About the Interview  App</h5>
              {/* <button type="button" className="btn-close text-white" data-bs-dismiss="modal" aria-label="Close"></button> */}
            </div>
            <div className="modal-body" style={{ padding: '20px', fontSize: '16px' }}>
              <p>The Interview Scheduler App is designed to streamline the interview process for both recruiters and candidates.
                 It features a user-friendly interface that allows users to easily:</p>
              <p>This app aims to reduce the back-and-forth communication typically associated with scheduling interviews,
                 ultimately saving time and improving the hiring experience.</p>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" style={{backgroundColor:'#1976D2'}}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>

  );
}

export default Navbar;
