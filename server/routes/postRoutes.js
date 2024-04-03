
const express = require ('express')

const {createPost,getPosts,getPost,getUserPosts,editPost,getCatPosts,deletePost, getAllPosts, } = require('../controllers/postControllers')
const authMiddleware = require('../middleware/authMiddleware')    

const router = express.Router();

router.post('/',authMiddleware, createPost) 
router.get('/',getAllPosts) 
router.get('/:id',getPost) 
router.patch('/:id',authMiddleware, editPost) 
router.get('/categories/:category',getCatPosts) 
router.get('/users/:id',getUserPosts) 
router.delete('/:id',authMiddleware, deletePost) 




module.exports = router;








