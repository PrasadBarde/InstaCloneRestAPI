const User = require("../models/user");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const secret = "RESTAPIAUTH";//secret key for jwt generation
//get all user
const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
    // console.log(users);
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  return res.status(200).json({
    message: "succses",
    users,
  });
};

//get one user
const getOneUser = async (req, res, next) => {
  let user;
  try {
    user = await User.findById(req.params.id);
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "No user found of this id" });
  }
  return res.status(200).json({
    message: "succses",
    user,
  });
};

//sign up the user/registering the user
const signupUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  //check the user is already present or not
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (existinguser) {
    return res
      .status(400)
      .json({ message: "user is already present,login Insted" });
  }

  //if user is not present already then add the new user details
  let user;
  const hasingPassword = bcrypt.hashSync(password);
  user = new User({
    name,
    email,
    password: hasingPassword,
    posts: [],
  });
  try {
    await user.save();
    // console.log(user);
  } catch (error) {
    return console.log(error);
  }
  return res
    .status(201)
    .json({ message: "user is registerd sucessfully", user });
};

//delete the user by id parameter from database
const deleteOneUser = async (req, res, next) => {
  let user;
  try {
    let id = req.params.id;
    user = await User.deleteOne({ id });
  } catch (err) {
    console.log(err);
  }
  if (!user) {
    return res.status(404).json({ message: "No user found of this id" });
  }
  return res.status(200).json({
    message: "succses",
    user,
  });
};

//update user by id
const updateUser = async (req, res, next) => {
  try {
    //  console.log(req.body);
    const hash = bcrypt.hashSync(req.body.password);
    req.body.password = hash;
    const user = await User.updateOne({ _id: req.params.id }, req.body);
    res.status(200).json({
      status: "Success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

//login the user
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  //check the user is  present or not
  let existinguser;
  try {
    existinguser = await User.findOne({ email });
  } catch (err) {
    return console.log(err);
  }
  if (!existinguser) {
    return res
      .status(404)
      .json({ message: "couldent find the user of this details" });
  }
  //comparing provided password is correct/matching
  //  with password which is present in data base
  const isPasswordCorrect = bcrypt.compareSync(password, existinguser.password); //give true/false

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Passwerd try again" });
  } else {
    // Create a token after login
    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: existinguser._id,
      },
      secret
    );
    console.log(token);

    
    return res
      .status(200)
      .json({ message: "Login successfull", existinguser, token });
  }
};


module.exports = {
  getAllUser,
  getOneUser,
  signupUser,
  deleteOneUser,
  updateUser,
  loginUser,
};
