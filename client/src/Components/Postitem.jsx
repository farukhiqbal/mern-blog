import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';


const Postitem = ({ postID,category,title,description,authorID,thumbnail,createdAt}) => {
 
 const shortDescription = description.length > 145? description.substr(0,145)+'...':description;
 const  PostTitle = title.length > 30? title.substr(0,30)+'...':title;



    return (
   

        <article className='post'>

           <div className="post_thumbnail">
           <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />

           </div>

             <div className="post_content">
                <Link to={`/posts/${postID}`}>

                 <h3>{PostTitle}</h3>
                </Link>
                <p>{shortDescription}</p>
                <div className="post_footer">
                    <PostAuthor authorID={authorID} createdAt={createdAt} />
                <Link to={`/Posts/categories/${category}`}className='btn category'>{category}</Link>

                </div>


             </div>



        </article>





  )
}

export default Postitem;