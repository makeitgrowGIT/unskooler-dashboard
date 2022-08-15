import React from 'react'

import { Route, Switch } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Customers from '../pages/Courses'
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
            <Route path='/instructors' component={Instructors}/>
            <Route path='/users' component={Users}/>
            <Route path='/financials' component={Financials}/>
            <Route path='/settings' component={Settings}/>
        </Switch>
    )
}

export default Routes
