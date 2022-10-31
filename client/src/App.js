
import React, { useEffect, createContext, useReducer, useContext } from 'react'
import './App.css';
import Navbar from './component/navbar'
import { BrowserRouter, Route, useHistory } from 'react-router-dom'
import Home from './component/screens/home'
import Signup from './component/screens/signup'
import Profile from './component/screens/profile'
import Signin from './component/screens/signin'
import Create from './component/screens/create'
import { initialState, reducer } from './reducer/userreducer'
import UserProfile from './component/screens/userProfile'
import Subscribepost from './component/screens/subscribepost'

export const UserContext = createContext()

const Routing = () => {
  const history= useHistory()
  const {state, dispatch}= useContext(UserContext) 
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if (user){
      dispatch({type:"USER", payload : user})
      history.push('/')
    }
    else{
      history.push('/signin')
    }
  },[])
  return (
    <switch>
      <Route exact path='/explore'>
        <Home />
      </Route>
      <Route path='/signup'>
        <Signup />
      </Route>
      <Route path='/signin'> 
        <Signin />
      </Route>
      <Route exact path='/profile'>
        <Profile />
      </Route>
      <Route path='/create'>
        <Create />
      </Route>
      <Route path='/profile/:userid'>
        <UserProfile />
      </Route>
      <Route exact path='/'>
        <Subscribepost />
      </Route>
    </switch>
  )
}

function App() {
  const [state, dispatch]= useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <Navbar />
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
