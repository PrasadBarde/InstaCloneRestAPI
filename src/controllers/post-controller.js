const Post = require("../models/post");
const User = require("../models/user");
const paginate = require("express-paginate");
const { default: mongoose } = require("mongoose");
var jwt = require("jsonwebtoken");
const secret = "RESTAPIAUTH";
//get all the post exists in db
const getAllPosts = async (req, res, next) => {
  let posts;
  // console.log(req.body);
  try {
    //for pagignation part  L44-45
    // const {page = 1, pagesize =5} = req.query;

    // const posts = await Post.find().skip((page-1) * pagesize).limit(pagesize);
    posts = await Post.find();
  } catch (e) {
    return console.log(e);
  }

  if (!posts) {
    res.status(400).json({
      message: "No Posts Found",
    });
  }
  return res
    .status(200)
    .json({ message: "success following are the posts", posts });
};

//get one post by id
const getOnePost = async (req,res,next)=>{
    let post;
    try {
        post = await Post.findById(req.params.id);
    } catch (error) {
        return console.log(error);
    }
    if(!post){
        return res.status(404).json({message : "post not found of this id"})
    }
return res.status(200).json({message:"sucsses",post})

}

// add the new post
const addOnePost = async (req, res, next) => {
  const { title, description, image, user } = req.body;


  //authorisation part verification
console.log(req.headers.authorization);
const verifytokan = jwt.verify(req.headers.authorization,secret);
    console.log(verifytokan);
    const verifyUser =  await User.findById(verifytokan.data);

//checking user is existing or not
let existingUser;
try {
    existingUser = await User.findById(user)
} catch (error) {
    return console.log(error);
}
 
if(!existingUser){
    return res.status(400).res.json({message:"unable to find the user of this id"})
}
  const post = new Post({
    title,
    description,
    image,
    user,
  });
  try {
    // await post.save();

    //it is for starting the transactions/sessions
    const session = await mongoose.startSession();  
    session.startTransaction();
    await post.save({session});
    existingUser.posts.push(post);
    await existingUser.save({session});
    await session.commitTransaction();//it is for ending the transactions/sessions

  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: "Failed",
      message: error.message,
    });
  }

  return res.status(200).json({ message: "succesfuly posted the post", post });
};

//delete the post by id parameter from database
const deleteOnePost = async (req, res, next) => {
  let post;
  try {
    let id = req.params.PostId;
    // console.log(id);
    post = await Post.findByIdAndRemove( id ).populate("user"); //populate is use as a refrence here used as a refrence of user collectin
    await post.user.posts.pull(post);
    await post.user.save();
  } catch (err) {
    console.log(err);
  }
  if (!post) {
    return res.status(404).json({ message: "No post found of this id" });
  }
  return res.status(200).json({
    message: "succses",
    post,
  });
};

//update user by id
const updatePost = async (req, res, next) => {
  let post;
  try {
    //  console.log(req.body);
    //  console.log(req.params.Id);

    // let search = await Post.findById(req.params.Id);
    // console.log(search);

    //    post = await Post.updateOne({ _id: req.params.Id }, req.body);
    //updateOne gives the latest updated value

    post = await Post.findByIdAndUpdate(req.params.Id, req.body);
    //findByIdAndUpdate it will give the previous info of post which was before update
    res.status(200).json({
      status: "Success",
      post,
    });
  } catch (err) {
    return res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

module.exports = { getAllPosts,getOnePost, addOnePost, deleteOnePost, updatePost };
