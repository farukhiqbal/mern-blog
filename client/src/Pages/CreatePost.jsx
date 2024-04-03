import React, { useContext, useState } from 'react';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import axios from 'axios'; 
import {useNavigate} from 'react-router-dom'
import {UserContext} from '../context/userContext'


const CreatePost = () => {
  const [title,settitle] = useState('')
const [category,setcategory] = useState('Uncategorized')
const [description,setdescription] =  useState('')
const [thumbnail,setthumbnail]  = useState('')
const [error,setError] = useState('')
const navigate = useNavigate();

const {currentUser} = useContext(UserContext)
const token = currentUser?.token;

const modules = {
            toolbar:[
               [{'header':[1,2,3,4,5,6 ,false]}],
               ['blod','italic','underline','strike','blockqoute'],
               [{'list':'ordered'},{'list':'bullet'},{'indent':'-1'},{'indent':'+1'}],
               ['link','image'],
               ['clean']

            ],
}


const formats = [
  'header',
  'blod','italic','underline','strike','blockqoute',
  'list','bullet','indent',
  'link','image'

]




const POST_CATEGORIES = ['Agriculture','Business','Education','Entertainment','Art','Investment','Uncategorized','Weather']





const createPost  = async(e) =>{
   e.preventDefault();
   const postData =  new FormData();
   postData.set('title',title)
   postData.set('category',category)
   postData.set('description',description)
   postData.set('thumbnail',thumbnail)

   try{
       const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/posts`,postData,
       {withCredentials:true,headers:{Authorization: `Bearer ${token}`}})
       if(response.status == 201){
        return navigate('/')
       }
   }catch(err){
        setError(err.response.data.message);
   }


}





  return (
   <section className='create-post'>
    <div className="container">
      <h2>Create Post</h2>
     {error &&   <p className="form_error-message"> {error} </p>}

<form  className="form create-post_form"  onSubmit={createPost}>
    <input type="text" name="" placeholder='Title' value={title} onChange={e => settitle(e.target.value)} autoFocus />

<select name="category"   value={category} onChange={e => setcategory(e.target.value)} >

{  
          POST_CATEGORIES.map(cat =>    <option key={cat}> {cat}</option> ) 
}
</select>

       <ReactQuill modules={modules} formats={formats} value={description} onChange={setdescription}/>
  <input type="file" onChange={e => setthumbnail(e.target.files[0])} accept='png,jpg,jpeg'  />

 <button type='submit' className='btn primary'>create</button>


</form>



    </div>

   </section>
  )
}

export default CreatePost
