const express = require("express");
const app = express()
const {getAllUser,getOneUser,signupUser,deleteOneUser,updateUser,loginUser} = require("../controllers/user-controller");
const bodyparser = require("body-parser");
const router =  express.Router();

router.use(bodyparser.json());


//get all users
router.get("/", getAllUser);

// Specific user
router.get("/:id", getOneUser);

 
// registering the user
router.post("/signup", signupUser);

// // delete using id
router.delete("/:id",deleteOneUser);


 // update using id
router.put("/:id", updateUser);

//login the user
router.post("/login",loginUser);


// // UPDATE
// // router.put("//:email", async (req, res) => {
// //     try{
// //         // Write the code to create the data
// //         // console.log(req.body);
// //         const user = await User.updateMany({email : req.params.email}, {$set : {name: req.body.name}});
// //         res.json({
// //             status: "Success",
// //             user
// //         })
// //     }catch(e) {
// //         res.status(400).json({
// //             status: "Failed",
// //             message: e.message
// //         })
// //     }
// // });

module.exports = router;
