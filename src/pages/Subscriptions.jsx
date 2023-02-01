import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalBody } from 'reactstrap';
import "../pages/subscriptions.css";
import { SubscriptionService } from '../services/SubscriptionService';

export default function Subscriptions() {
    const [subs, setsubs] = useState([])
    const [modal, setmodal] = useState(false);
    const [loading, setloading] = useState(false)
    const [deleteObj,setdeleteObj] = useState({})
    var subService= new SubscriptionService()
    const role = localStorage.getItem("role")
    useEffect(() => {
        loadSubs().then(()=>setloading(false))
    }, [])
    async function loadSubs(){
        setloading(true)
        var dbSubs = await subService.getAllSubscriptions();
        setsubs(dbSubs)
    }
    function formatDate(date){ 
        var d =new Date(date)
        return d.getDate()+"/"+d.getMonth()+"/"+d.getFullYear()
    }
    
    return (
        loading? <div style={{"width":"100%","height":"100%","display":"flex","alignItems":"center","justifyContent":"center"}}>
            <i className="bx bx-loader" style={{"fontSize":"70px"}}/>
        </div>: <div>
            <Modal isOpen={modal} toggle={() => setmodal(!modal)}>
            <ModalBody >
                Are you sure you want to delete the subscription??<br></br>
              <Button onClick={() => {
                setloading(true)
                if (deleteObj && role=="admin") {
                    subService.deleteSubscription(deleteObj.subscriptionID).then(()=>{
                        setloading(false)
                        setmodal(false)
                        loadSubs().then(()=>setloading(false))
                    })}
                else{
                  alert("You are not authorized to perform this operation")
                }
              }}>Yes</Button> <Button onClick={() => { setmodal(false) }}>No</Button>
              </ModalBody>
            </Modal>
            <h2 className='userPageHeading'>{subs.length} Subscriptions</h2>
            <div className="subHolder">
                {subs.map((s)=>{return  <div className="subCard">
                    <div className="subThumbnail" style={{"backgroundImage":`url("${s.thumbnailUrl}")`}}></div>
                    <div className="row"><h4>{s.className}</h4></div>
                    <div className="row"><h6 style={{"textDecoration":"underline"}}>{s.userName}({s.email})</h6></div>
                    <hr/>
                    <div className="row"  style={{"marginLeft":"2px"}}>
                    Purchased Date: {formatDate(s["baughtDate"])} <br/>
                    End Date: {formatDate(s["endDate"])} 
                    </div>
                    <hr/>
                    <div style={{"display":"flex","alignItems":"center","justifyContent":"space-between"}}>
                        <div style={{"padding":"5px","backgroundColor":"#ff2222","borderRadius":"3px","color":"white",'cursor':"pointer"}} role="button" onClick={()=>{
                            console.log(s.subscriptionID)
                            setdeleteObj(s)
                            setmodal(true)
                        }}><i className='bx bx-trash'></i></div>
                        <span></span><h3>₹{s.price}/-</h3>
                    </div>
                </div>
                })}
            </div>
        </div>
    )
}
