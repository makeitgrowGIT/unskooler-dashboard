import React, { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

import './sidebar.css'

import logo from '../../assets/images/logo.svg'

import sidebar_items from '../../assets/JsonData/sidebar_routes.json'
import howToFile from "../../assets/HowTo.txt"

const SidebarItem = props => {

    const active = props.active ? 'active' : ''

    return (
        <div className="sidebar__item">
            <div className={`sidebar__item-inner ${active}`}>
                <i className={props.icon}></i>
                <span>
                    {props.title}
                </span>
            </div>
        </div>
    )
}

const Sidebar = props => {

    const activeItem = sidebar_items.findIndex(item => item.route === props.location.pathname)
    const [showSidebar, setshowSidebar] = useState(true)
    useEffect(() => {
      var loc = window.location.href;
      console.log("loc")
      setshowSidebar(loc.split("/").at(-1)==="")
      
    }, [])
    
    return (
        <div className='sidebar' style={{display:showSidebar?"none":"block"}}>
            <div className="sidebar__logo"  style={{cursor:"pointer"}} href={ howToFile} target="_blank" download>
                <img src={logo} alt="company logo"/>
            </div>
            {
                sidebar_items.map((item, index) => (
                    <Link to={item.route} key={index} > 
                        <SidebarItem
                            title={item.display_name}
                            icon={item.icon}
                            active={index === activeItem}
                            
                        />
                        <hr/>
                    </Link>
                ))
            }
            
            <div style={{cursor:"pointer"}} onClick={()=>{
                localStorage.clear()
                window.location.href='/'
            }}>
            <SidebarItem
                            title="Logout"
                            icon="bx bx-user-circle"
                            
                        /></div>
            <Link className="sidebar__logo"  style={{cursor:"pointer"}} to={ howToFile} target="_blank" download>
            <SidebarItem
                            title="Guide"
                        />
            </Link>
        </div>
    )
}

export default Sidebar
