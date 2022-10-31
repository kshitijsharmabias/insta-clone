import React,{useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../App'
const Navbar =()=>{
  const {state, dispatch} = useContext(UserContext)
  const history = useHistory()
  const renderList =()=>{
    if (state){
      return [
        <li><Link to="/profile">profile</Link></li>,
        <li><Link to="/create">Create</Link></li>,
        <li><Link to="/explore">explore</Link></li>,
        <li>
          <button className="btn waves-effect waves-light #c62828 red darken-3" onClick={()=>
          {
            localStorage.clear()
            dispatch({type:"CLEAR"})
            history.push('/signin')
          }}>Log Out 
                </button>
        </li>
      ]
    }
    else{
      return [
        <li><Link to="/signin">login</Link></li>,
        <li><Link to="/signup">signup</Link>k</li>
      ]

    }  
  }
  return (
    <nav>
    <div className="nav-wrapper white">
      <Link to={state?"/":"/signin"} className="brand-logo">Instagram</Link>
      <ul id="nav-mobile" className="right">
        
        {renderList()}
      </ul>
    </div>
  </nav>
  )
}
export default Navbar