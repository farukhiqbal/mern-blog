const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
const fs = require('fs')
const path = require('path')
const {v4:uuid} = require("uuid")



const User = require("../models/userModel")
const HttpError = require("../models/errorModel")

//======================register a new user=====================//
//post : api/users/register

// unprotected routes


const registerUser = async (req, res, next) => {

  try {
    const { name, email, password, password2 } = req.body;
    if (!name || !email || !password) {
      return next(new HttpError("Fill  all the fields", 422));
    }

    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });

    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }

    if (password.trim().length < 6) {
      return next(
        new HttpError("password should be at least 6 character.", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("password do not match", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);
    const newUser = await User.create({ name,email: newEmail, password: hashedPass});

    res.status(201).json(`New user ${newUser.email} registered`);
  } catch (error) {
    return next(new HttpError("user register failed.", 422));
  }
};





//======================Login a register user=====================//
//post : api/users/login
// unprotected routes


const loginUser = async (req,res,next) =>{

  try{

const {email,password} = req.body;
if(!email || !password){
  return next(new HttpError("Fill all the field",422))
}

const newEmail = email.toLowerCase();

const user = await User.findOne({email:newEmail})
if(!user){
  return next(new HttpError("invalid username",422))
}

const comparePass = await bcrypt.compare(password, user.password)
if(!comparePass){
  return next(new HttpError("invalid password",422))

}

const {_id:id, name } = user;
const token = jwt.sign({id,name},process.env.JWT_SECRET,{expiresIn:"1d"} )
 res.status(200).json({token,id ,name})



  } catch (error){
      return next(new HttpError("login failed .please check your email and password",422))
  }


}










//======================user  profile=====================//
//post : api/users/:id
// protected routes
const getUser = async (req, res, next) => {
  
     try{
          const {id} = req.params;
          const user = await User.findById(id).select('-password');
          if (!user){
            return next(new HttpError("user not found",404))
          }
         res.status(200).json(user);

     }   catch (error){
      return next(new HttpError(error))
  }



};











//======================change user avatar (profile picture)=====================//
//post : api/users/change-avatar
// protected routes
const changeAvatar = async (req, res, next) => {
 try{

      if(!req.files.avatar){
        return next(new HttpError("please choose an image.",422))
      }
      //find the user from the database 
      const user = await User.findById(req.user.id)
       // delete the  old the avatar if exists
         if(user.avatar){
          fs.unlink(path.join(__dirname, '..', 'uploads',user.avatar),(err)=> {
            if(err){
              return next(new HttpError(err))
            }
          })
         }

         const {avatar} = req.files;
         //check the file size 
          if (avatar.size > 500000){
            return next(new HttpError('profile picture is too big. should be less than 500kb ',422))
          }

   let fileName;
   fileName = avatar.name;
   let splittedFilename = fileName.split('.');
   let newFilename = splittedFilename[0] + uuid() +'.' + splittedFilename[splittedFilename.length -1]
   avatar.mv(path.join(__dirname,'..','uploads', newFilename), 
   async(err) => {
    
    if(err){
       return next(new HttpError(err))
    }
      const updatedAvatar = await User.findByIdAndUpdate(req.user.id,{avatar:newFilename},{new: true})
     if(!updatedAvatar){
         return next(new  HttpError("Avatar couldn't be changed.",422))
     }
   
     res.status(200).json(updatedAvatar);



   })


 }catch(error){
  return next(new HttpError(error))
 }
};













//======================edit the user detail (from profile)=====================//
//post : api/users/edit-user
// protected routes

const editUser = async (req, res, next) => {
     try{
      const {name , email, currentPassword , newPassword , confirmNewPassword  } = req.body;
      
      if(!name || !email || !currentPassword || !newPassword) {
         return next(new HttpError("Fill all  fields ",422))
      }

  //get user from database
const user = await User.findById(req.user.id);
    if (!user){
      return next(new HttpError("user not found.",403))

    }
    //make sure new email doesn't already exist
    const emailExists = await User.findOne({email});
    if(emailExists && (emailExists._id != req.body.id)){
      return next(new  HttpError("Email already exist.",422))
    }


   //compare  current password to db password
const validateUserPassword = await bcrypt.compare(currentPassword,user.password);
   if (!validateUserPassword){
    return next (new HttpError('Invalid current password',422))
   }

//compare new password
if (newPassword !== confirmNewPassword){
  return next(new HttpError("new password do not match.",422))
}

// hash new password
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(newPassword,salt);
  
  //update the user info in data base
  const newInfo = await User.findByIdAndUpdate(req.user.id,{name,email,password:hash},{new:true})
  res.status(200).json(newInfo)





     }catch(error){
      return next(new HttpError(error))
     }
};



















//======================get authors=====================//
//post : api/users/get authors
// unprotected routes
const getAuthors = async (req, res, next) => {
  try{

    const authors = await User.find().select('-password');
res.json(authors);
  }catch (error){
    return next(new HttpError(error))

  }
};










module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
