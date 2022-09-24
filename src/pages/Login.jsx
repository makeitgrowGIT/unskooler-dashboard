import React, { useEffect, useState } from "react";
import "./login.css";
import Logo from "../assets/images/logo.svg"
import { LoginService } from "../services/LoginService";


function Login() {

  // method is for changing dailyStatus according to time 
  let today = new Date();
  let hours = today.getHours();
  let dailyStatus;
  const [username, setusername] = useState("")
  const [password, setpassword] = useState("")
  const [remember, setremember] = useState(false)

  useEffect(() => {
    let remember = localStorage.getItem("remember")
    if(JSON.parse(remember)){
      window.location.href='/class'
    }
  }, [])
  
  if (hours > 18) {
    dailyStatus = 'Good Evening 🌕';
  } else if (hours > 12) {
    dailyStatus = 'Good afternoon 🌥️';
  } else if (hours > 0) {
    dailyStatus = 'Good Morning  ☀️ ';
  } else {
    dailyStatus = 'welcome';
  }

  async function logInUser() {
    const loginService = new LoginService();
    let result  =  await loginService.verifyAdmin(username,password);
    console.log(result)
    if (result) {
      localStorage.setItem("username",username)
      localStorage.setItem("loggedIn",true)
      if (remember) {
        localStorage.setItem("remember",true)
      }
      window.location.href='/class'
    } else {
      alert("Wrong password")
    }
  }

  // const mediaQuery = window.matchMedia('(max-width: 700px)')
  // if (mediaQuery.matches) {
  //   // Then trigger an alert
  //   alert('Media Query Matched!')
  // }

  return (
    <>
    <div className="notForMobile">
     <h1 className="warning">This site is not compatible with mobile devices please open in Desktop mode</h1>
    </div>
      <div className="loginHeroContainer">
        <div className="leftContainer">
          <div className="leftInnerContainer">
            <img src={Logo} alt="logo" />
            <div className="loginImage">
              {/* <img src={loginImage} alt="logo" /> */}
            </div>
          </div>
        </div>
        <div className="rightContainer">
          <div className="loginBox">
            <div className="gmText">
              Hello!<br></br>
              {dailyStatus}
            </div>
            <h2>
              <span className="loginText">Login</span> to your account
            </h2>
            <form action="#">
              <div className="input_field">
                <p>Username</p>
                <input className="inputText" type="text" placeholder="Enter your uername" onChange={(e)=>{setusername(e.target.value)}} required></input>
              </div><br></br>
              <div className="input_field">
                <p>Password</p>
                <input className="inputText" type="password" placeholder="Enter your Password" onChange={(e)=>{setpassword(e.target.value)}}  required></input>
              </div>

              <div className="checkboxText">
                <div className="checkboxContent">
                  <input type={"checkbox"} onChange={(e)=>{setremember(e.target.checked)}} id="logCheck"></input>
                  <label for="logCheck" className="text" style={{ color: "black", fontWeight: "600" }}>Remember me</label>
                </div>

                <a href="#" className="text" style={{ paddingRight: "1vw" }}>Forget Your Password?</a>
              </div>

              <div className="input_field button">
                <input type="button" value="login" onClick={logInUser}></input>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
