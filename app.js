const mongoose = require("mongoose");
const express = require('express');
const userRoutes = require("./src/routes/user-routes");
const PostRoutes = require("./src/routes/posts-routes")
// console.log(userRoutes);
const uri= process.env.MONGODB_URI;
const app =express();
app.use(express.json())
app.use("/api/user",userRoutes)  //http://localhost :3000/api/user/........
app.use("/api/post",PostRoutes)  //http://localhost :3000/api/post/........
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb+srv://Insta:vT1TdWejx3ILdjFS@cluster0.nnwuc1l.mongodb.net/Instagram?retryWrites=true&w=majority",
).then(()=>app.listen(3000,console.log("3000"))).then(() => {
    console.log("server is running on localhost 3000");
  }).catch((err)=>console.log(err));