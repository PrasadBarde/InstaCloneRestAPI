const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const postSchema = new Schema({
    // Your code goes here
   title: {type : String,required:true},
    description:{type : String,required:true},
    image: {type : String,required:true},
    user: {type :mongoose.Types.ObjectId, ref: "User",required: true}
,
})

const Post = mongoose.model('post', postSchema);
module.exports = Post;