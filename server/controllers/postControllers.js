const Post = require("../models/PostModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const { post } = require("../routes/postRoutes");

//================================create a post
//post :api/posts
//Protected route
const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;

    // Debugging: Log values to the console
    console.log("title:", title);
    console.log("category:", category);
    console.log("description:", description);
    console.log("req.files:", req.files);

    if (!title || !category || !description || !req.files) {
      // Debugging: Log error message to the console
      console.error("Fill all the fields and choose Thumbnail.");
      return next(
        new HttpError("Fill all the fields and choose Thumbnail.", 422)
      );
    }

    const { thumbnail } = req.files;

    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big. Files should be less than 2mb.")
      );
    }

    let fileName = thumbnail.name;
    let splittedFilename = fileName.split(".");
    let newFilename =
      splittedFilename[0] +
      uuid() +
      "." +
      splittedFilename[splittedFilename.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFilename),
      async (err) => {
        if (err) {
          // Debugging: Log error message to the console
          console.error(err);
          return next(new HttpError(err));
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFilename,
            creator: req.user.id,
          });

          if (!newPost) {
            // Debugging: Log error message to the console
            console.error("Post couldn't be created.");
            return next(new HttpError("Post couldn't be created.", 422));
          }

          // Find the user and increase the post count by 1
          const currentUser = await User.findById(req.user.id);
          const userPostCount = currentUser.posts + 1;
          await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    // Debugging: Log error message to the console
    console.error(error);
    return next(new HttpError(error));
  }
};




//get all post api 
   const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    if (!posts || posts.length === 0) {
      return next(new HttpError("No posts found", 404));
    }

    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error.message));
  }
};













//================================get  single post 
//Get :api/posts/id
//Protected route

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId); // Corrected from 'post' to 'Post'
    if (!post) {
      return next(new HttpError("post not found", 404));
    }

    res.status(200).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};




//================================Get posts by category
//get :api/posts/categories/:category
//UnProtected route

const getCatPosts = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createAt: -1 });
    res.status(200).json(catPosts);
  } catch (error) {
    return next(new HttpError(error));
  }
};

//================================Get user/Authors posts
//Get :api/posts/users/:id
//unProtected route

const getUserPosts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const posts = await Post.find({ creator: id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};











//================================Edit posts
//patch :api/posts/:id
//Protected route

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFilename;
    let updatedPost;
    const postId = req.params.id;
    let { title, category, description } = req.body;
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill in all fields ", 422));
    }
    if (!req.files) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      );
    } else {
      //   get old post form the database
      const oldPost = await Post.findById(postId);
      //delete old thumbnail  form upload
      fs.unlink(
        path.join(__dirname, "..", "uploads", oldPost.thumbnail),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          }
        })

      //upload the new thumbnail
      const { thumbnail } = req.files;
     //check file size 

      if (thumbnail.size > 2000000) {
        return next(
          new HttpError("Thumbnail  too big. Should be less than in 2mb")
        );
      }

      fileName = thumbnail.name;
      let splittedFilename = fileName.split(".");
      newFilename = splittedFilename[0] + uuid() +
        splittedFilename[splittedFilename.length - 1];
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFilename),
        (err) => {
          if (err) {
            return next(new HttpError());
          }
        }
      )

      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description, thumbnail: newFilename }, // Corrected field name
        { new: true }
      );
  
  
  
      }

    if(!updatedPost){
      return next(new HttpError("Could't update post ",400))
    }
      res.status(200).json(updatedPost)

  } catch (error) {
    return next(new HttpError(error));
  }
};








//================================Delete posts
//delete :api/posts/:id
//Protected route

const deletePost = async (req, res, next) => {
   try{
     const postId = req.params.id;
  if(!postId){
   return next(new HttpError("post unavailable",400))
  }
     const post = await Post.findById(postId);
     const fileName = post?.thumbnail;
     if(req.user.id == post.creator){
          //delete thumbnail from upload floder
      fs.unlink(path.join(__dirname,'..','uploads',fileName),async(err)=>{
      if(err){
         return next(new HttpError(err))
      }else{
         await Post.findByIdAndDelete(postId);
         //find the user and reduce post count by 1
         const currentUser = await User.findById(req.user.id);
         const userPostCount = currentUser?.posts -1;
         await User.findByIdAndUpdate(req.user.id,{posts: userPostCount})
         res.json(`Post ${postId} deleted successfully. `)
      }
   })
     }  else{
        return next(new HttpError('post could not  be deleted',403))
     }
   
          
   }catch(error){
      return next(new HttpError(err))
   }

};







module.exports = {
  createPost,
  getAllPosts,
  getPost,
  getUserPosts,
  editPost,
  getCatPosts,
  deletePost,
};
