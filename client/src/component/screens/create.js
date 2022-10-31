import React, { useState,useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
const Create = () => {
    const history= useHistory()
    const [title, setTitle]=useState("")
    const [body, setBody]=useState("")
    const [image, setImage]=useState("")
    const [url, setUrl]=useState("")
    useEffect(()=>{
        if (url){
        fetch('/createpost', {
            method: "post",
            headers: {
                "content-type": "application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                title,
                body,
                pic:url
            })
        }).then(res=>res.json())
            .then(data=>{
                if (data.error) {
                    M.toast({ html: data.error })
                }
                else{
                    M.toast({ html: "created post succesfully",classes:"#4db6ac teal lighten-2"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)

            })
        }
    },[url])
    const PostData=()=>{
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
    return (
        <div className="card input-filed"
            style={{
                margin: "30px auto",
                maxWidth: "500px",
                padding: "20px",
                textAlign: "center"

            }}>
            <input type="text" placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}></input>
            <input type="text" placeholder="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}></input>
            <div className="file-field input-field">
                <div className="btn #64b5f6 blue darken-1">
                    <span>Upload Image</span>
                    <input type="file"
                    onChange={(e) => setImage(e.target.files[0])}/>
                </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                    </div>
                    <button className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>PostData()}>Submit
                </button>


                </div>

            )
}
export default Create