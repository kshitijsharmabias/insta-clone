import React,{useState,useEffect,useContext} from 'react'
import { UserContext } from '../../App'
const Profile=()=>{
    const [mypics,setPics]= useState([])
    const {state,dispatch}= useContext(UserContext)
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)
    console.log(state)
    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization": "Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result =>{
            console.log(result)
            setPics(result.posts)
        })
    },[])
    useEffect(() => {
        if(image){
            const Data= new FormData()
        Data.append("file",image)
        Data.append("upload_preset","instagram-clone")
        Data.append("cloud_name","kshitijcloud")
        fetch('https://api.cloudinary.com/v1_1/kshitijcloud/image/upload',{
            method:"post",
            body:Data
        }).then(res=>res.json())
        .then(data=>{
            //setUrl(data.url)
            //console.log(data)
            
            fetch('/updatepic',{
                method:"put",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": "Bearer "+localStorage.getItem("jwt")
      
                },
                body:JSON.stringify({
                    pic:data.url
                })
            }).then(res=>res.json())
            .then(result=>{
                console.log(result)
                localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
                dispatch({type:"UPDATEPIC",payload:result.pic})
            })
            //window.location.reload()
        })
        .catch(err=>{ 
            console.log(err)
        })

        }
    }, [image])
    const updatePhoto=(file)=>{
        setImage(file)
        

    }
    if(state===null){
        return (
            <h5>Loading</h5>
        )
    }
    return (
        
        <div style={{maxWidth:"550px", margin:"0px auto"}}>
            <div style={{
                margin:"20px 0px",
                borderBottom:"1px solid grey"

            }}>
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                
            }}>
                <div>
                    <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:"loading"}></img>
                </div>
                <div><h5>{state?state.name:"loading"}</h5>
                <div style={{display:'flex', justifyContent:'space-between',width:'110%'}}>
                    <h6>{mypics.length} post</h6>
                    <h6>{state?state.followers.length:"0"} followers</h6>
                    <h6>{state?state.following.length:"0"} following</h6>

                </div>
                </div>
            </div>
            <div className="file-field input-field" style={{margin:"20px 0px 10px 45px"}}>
                <div className="btn #64b5f6 blue darken-1">
                    <span>Update Profile pic</span>
                    <input type="file"
                    onChange={(e) => updatePhoto(e.target.files[0])}/>
                </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                    </div>
            </div>
        <div className="Gallery">
            {
            mypics.map(item=>{
                return (
                    <img key={item._id} className="item" src={item.photo} alt={item.title}></img>
                )
            })
}
        </div>
        </div>
    )
}
export default Profile