import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import M from 'materialize-css'
const Signup = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    useEffect(() => {
        if (url)
        {
            uploadField()
        }
    }, [url])
    const uploadpic=()=>{
        const Data= new FormData()
        Data.append("file",image)
        Data.append("upload_preset","instagram-clone")
        Data.append("cloud_name","kshitijcloud")
        fetch('https://api.cloudinary.com/v1_1/kshitijcloud/image/upload',{
            method:"post",
            body:Data
        }).then(res=>res.json())
        .then(data=>{
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

    }
    const uploadField= ()=>{
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: "invalid email" ,classes:"#e53935 red darken-1"})
            return
        }
        fetch('/signup', {
            method: "post",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
            .then(data=>{
                if (data.error) {
                    M.toast({ html: data.error })
                }
                else{
                    M.toast({ html: data.message,classes:"#4db6ac teal lighten-2"})
                    history.push('/signin')
                }
            }).catch(err=>{
                console.log(err)

            })


    }
    const PostData = () => {
        if (image){
            uploadpic()
        }
        else{
            uploadField()
        }
        
    }
    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Instagram</h2>
                <input
                    type="text"
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}>
                </input>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}>
                </input>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input>
                <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Profile Image</span>
                    <input type="file"
                    onChange={(e) => setImage(e.target.files[0])}/>
                </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                    </div>
                <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={() => PostData()}>Submit
                </button>
                <Link to='/signin' style={{ paddingLeft: "5px" }}>ALready have an Account</Link>

            </div>

        </div>
    )
}
export default Signup