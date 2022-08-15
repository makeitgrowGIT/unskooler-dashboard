import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Courses'
import Class from '../pages/Class'
import Subject from '../pages/Subject'
import Chapter from '../pages/Chapter'
import Module from '../pages/Module'
import Instructors from '../pages/Instructors'
import Users from '../pages/Users'
import Financials from '../pages/Financials'
import Settings from '../pages/Settings'

const Routes = () => {
    return (
        <Switch>
            <Route path='/' exact component={Login}/>
            <Route path='/dashboard' component={Dashboard}/>
            <Route path='/customers' component={Customers}/>
            <Route path='/class' component={Class}/>
            <Route path='/subject' component={Subject}/>
            <Route path='/chapter' component={Chapter}/>
            <Route path='/Module' component={Module}/>
            <Route path='/instructors' component={Instructors}/>
            <Route path='/users' component={Users}/>
            <Route path='/financials' component={Financials}/>

            {/* <Route path='/settings' component={Settings}/> */}
        </Switch>
    )
}

export default Routes
