import React from "react";
import "./login.css";
import Logo from "../assets/images/logo.svg"


const Login = () => {

  // method is for changing dailyStatus according to time 
  let today = new Date();
  let hours = today.getHours();
  let dailyStatus ; 

  if(hours > 18){
    dailyStatus = 'Good Evening 🌕';
  }else if(hours > 12){
     dailyStatus = 'Good afternoon 🌥️'; 
  }else if(hours > 0){
    dailyStatus = 'Good Morning  ☀️ ';
  } else {
    dailyStatus = 'welcome';
  }



  return (
    <>
      <div className="loginHeroContainer">
        <div className="leftContainer">
          <div className="leftInnerContainer">
            <img  src={Logo} alt="logo" />
            <div className="loginImage">
              {/* <img src={loginImage} alt="logo" /> */}
            </div>
          </div>
        </div>
        <div className="rightContainer">
          <div className="loginBox">
            <div className="gmText">
              Hello!<br></br>
             { dailyStatus }
            </div>
            <h2>
              <span className="loginText">Login</span> to your account
            </h2>
            <form action="#">
              <div className="input_field">
              <p>Email Address</p>
                <input className = "inputText" type= "text" placeholder = "Enter your Email" required></input>
              </div><br></br>
              <div className="input_field">
              <p>Password</p>
                <input className = "inputText" type="password" placeholder = "Enter your Password" required></input>
              </div>

              <div className="checkboxText">
                <div className="checkboxContent">
                  <input type={"checkbox"} id = "logCheck" ></input>
                  <label for = "logCheck" className="text" style={{color: "black" , fontWeight : "600"}}>Remember me</label>
                </div>

                <a href="#" className="text" style={{paddingRight : "1vw"}}>Forget Your Password ? </a>
              </div> 

              <div className="input_field button" >
                <input type= "button" value= "login" onClick={event =>  window.location.href='/dashboard'}></input>
              </div>  
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;