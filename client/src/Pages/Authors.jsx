import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import Loader from '../Components/Loader';

const Authors = () => {

  const [authors, setAuthors] = useState([]);
  const [loading,setLoading] = useState(false)

   useEffect(()=>{
   const getAuthors = async()=>{
        setLoading(true);
        try{
    const response = await axios.get(`https://mern-blog-kappa-one.vercel.app/users`)
    setAuthors(response.data);
        }catch(error){
          console.log(error)

        }
        setLoading(false)
       }
     getAuthors();
   },[])

   if(loading){
    return<Loader/>
   }



  return (
    <section className="authors">
      {authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map(({ _id:id, avatar, name, posts }) =>
           {
            return  <Link key={id} to={`/posts/users/${id}`} className="author">
              <div className="author_avatar">
                <img src={`https://mern-blog-kappa-one.vercel.app/uploads/${avatar}`} alt={`Image of ${name}`} />
              </div>
              <div className="author_info">
                <h4>{name}</h4>
                <p>{posts}</p>
              </div>
            </Link>
          })
          
          }
        </div>
      ) : (
        <h2 className="center">No user/authors found</h2>)}

    </section>
    
  );
};

export default Authors;
