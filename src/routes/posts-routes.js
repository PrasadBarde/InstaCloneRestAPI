const express = require("express");
const mongoose = require("mongoose");
const {getAllPosts,getOnePost,addOnePost,deleteOnePost,updatePost} = require("../controllers/post-controller");
const bcrypt = require('bcrypt');
const bodyparser = require("body-parser");

// var jwt = require('jsonwebtoken');
// const secret = "RESTAPIAUTH";

const PostRouter = express.Router();

PostRouter.use(bodyparser.json());


// parse application/x-www-form-urlencoded
PostRouter.use(bodyparser.urlencoded({ extended: false }))



//posting/adding one post to database
PostRouter.post("/posts", addOnePost);

//get all the posts from database
PostRouter.get("/posts", getAllPosts);

//get one  post from database by id
PostRouter.get("/:id",getOnePost)

//delete one post from database
PostRouter.delete("/:PostId",deleteOnePost)

//update post from database
PostRouter.put("/:Id",updatePost)

module.exports = PostRouter;