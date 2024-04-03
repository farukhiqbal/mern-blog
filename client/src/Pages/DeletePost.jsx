import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom'
import { UserContext } from '../context/userContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../Components/Loader';

const DeletePost = ({postId:id}) => {
  const navigate = useNavigate();
    const location = useLocation();
    const [loader,setLoader] = useState(false)
  const {currentUser}  = useContext(UserContext)
  const token = currentUser?.token;


  useEffect(()=>{
      if(!token){
        
        navigate('/login')
      }
  },[])


const removePost = async () =>{
  setLoader(true)
  try{
    const response = await axios.delete(`https://mern-blog-kappa-one.vercel.app/posts/${id}`,
    {withCredentials:true,headers:{Authorization: `Bearer ${token}`}})
    if(response.status == 200){
        if(location.pathname== `/myposts/${currentUser.id}`){
          navigate(0)
        }else{
          navigate('/')
        }

    }

    setLoader(false)
}catch(err){
      console.log('Could not be deleted ')
}
}


if(loader){
  return<Loader/>
}

  return (
    <>
     <Link className='btn sm danger'
      onClick={()=> removePost(id)}
     >Delete</Link>
    </>
  )
}

export default DeletePost