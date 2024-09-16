import React, { useContext, useEffect, useState } from 'react';
import {DUMMY_POSTS} from '../data'
import { Link, useNavigate,useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../Components/Loader'
import DeletePost from './DeletePost';

const Dashboard = () => {
   
  const [posts,setPosts] = useState({})
     const navigate = useNavigate();
     const [loading,setLoading] = useState(false)
     const {id} = useParams();

     const {currentUser} =  useContext(UserContext);
     
     const token = currentUser?.token;

        ///redirect to the login page 
        useEffect(()=>{
          if(!token){
            navigate('/login')
          }
        },[])


        useEffect(()=>{
          const fetchPosts = async() =>{
            setLoading(true);
            try{
               const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`,
               {withCredentials:true,headers:{Authorization:`Bearer${token}`}})    
               setPosts(response.data)
            }catch(error){
              console.log(error)
            }

            setLoading(false)
          }
          fetchPosts();
        },[])


  if(loading){
    return<Loader/>
  }

 
    return (
      
         <section className='dashboard'>
          {
            posts.length ? <div className="container dashboard_container">
          
{

       posts.map(posts => {

return <article key={posts.id} className='dashboard_post'>
    <div className="dashboard_post-info">
      <div className="dashboard_post-thumbnail">
        <img src={`${process.env.REACT_APP_BASE_URL}/uploads/${posts.thumbnail}`} alt="" />
      </div>
      <h5>{posts.title}</h5>
    </div>

     <div className="dashboard_post-action">

       <Link to={`/posts/${posts._id}`} className='btn  sm'>view</Link>
       <Link to={`/posts/${posts._id}/edit`} className='btn sm primary'>Edit</Link>
     <DeletePost postId={posts._id} />

     </div>


</article>



       })

}

            </div> : <h2 className='center'> You Have No post  yet.</h2>
          }

         </section>

  )
}

export default Dashboard
