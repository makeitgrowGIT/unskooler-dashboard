import React from 'react'
import './Users.css'
import '../pages/dashboard.css'




const Dashboard = () => {



    return (
    <div className='dashboardBorder'>
            <div className="div1">
            <div className="courseSold">
                        {/* <span class="material-icons-sharp">shopping_cart</span> */}
                        <div className="middle">
                            <div className="left">
                                <h4>Courses Sold Today</h4>
                                <h1>2,153</h1>
                            </div>
                            {/* <!-- <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="number">
                                    <p>81%</p>
                                </div>
                            </div> --> */}
                        </div>
                        {/* <small class="text_muted">This week</small> */}
                    </div>
            </div>


            <div className="div2">
            <div className="income">
                        {/* <span class="material-icons-sharp">payments </span> */}
                        <div className="middle">
                            <div className="left">
                                <h4>Today Income</h4>
                                <h1>14,243</h1>
                            </div>
                            {/* <!-- <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="number">
                                    <p>10%</p>
                                </div>
                            </div> --> */}
                        </div>
                        {/* <small class="text_muted">This week</small> */}
                    </div>
             </div>


            <div className="div3">
            <div className="MembersOnline">
                        {/* <span class="material-icons-sharp">groups</span> */}
                        <div className="middle">
                            <div className="left">
                                <h4> Members Online</h4>
                                <h1>248</h1>
                            </div>
                            {/* <!-- <div class="progress">
                                <svg>
                                    <circle cx="38" cy="38" r="36"></circle>
                                </svg>
                                <div class="number">
                                    <p>28%</p>
                                </div>
                            </div> --> */}
                        </div>
                        {/* <!-- <small class="text_muted">Last 24 hours</small> --> */}
                    </div>

            </div>
            <div className="div4">D </div>
            <div className="div5">E </div>
            <div className="div6">F </div>
    </div>  
    )
}

export default Dashboard
